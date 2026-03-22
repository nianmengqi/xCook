import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbGet, dbAll, dbRun } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const menu = dbGet(
      'SELECT * FROM daily_menus WHERE userId = ? AND date = ?',
      [req.user!.userId, targetDate]
    );

    if (!menu) {
      return res.json({
        date: targetDate,
        recipeIds: [],
        recipes: [],
        totalCalories: 0,
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
        shoppingList: []
      });
    }

    const recipeIds: string[] = JSON.parse(menu.recipeIds);
    const recipes = recipeIds.length > 0 
      ? dbAll(`SELECT * FROM recipes WHERE id IN (${recipeIds.map(() => '?').join(',')})`, recipeIds)
      : [];

    const recipesWithDetails = recipes.map(r => ({
      ...r,
      tags: JSON.parse(r.tags),
      ingredients: JSON.parse(r.ingredients),
      steps: JSON.parse(r.steps),
      nutrition: JSON.parse(r.nutrition),
      isPublic: Boolean(r.isPublic),
    }));

    const shoppingList = aggregateShoppingList(recipesWithDetails);
    const totals = calculateTotals(recipesWithDetails);

    res.json({
      ...menu,
      recipeIds,
      recipes: recipesWithDetails,
      ...totals,
      shoppingList
    });
  } catch (error) {
    console.error('Get daily menu error:', error);
    res.status(500).json({ error: '获取每日菜单失败' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { date, recipeIds } = req.body;
    
    if (!date) {
      return res.status(400).json({ error: '请选择日期' });
    }

    if (!recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({ error: '请选择菜谱' });
    }

    const targetDate = date;
    const existing = dbGet(
      'SELECT * FROM daily_menus WHERE userId = ? AND date = ?',
      [req.user!.userId, targetDate]
    );

    const recipes = recipeIds.length > 0 
      ? dbAll(`SELECT * FROM recipes WHERE id IN (${recipeIds.map(() => '?').join(',')})`, recipeIds)
      : [];

    const totals = calculateTotals(recipes.map(r => ({
      ...r,
      ingredients: JSON.parse(r.ingredients),
      nutrition: JSON.parse(r.nutrition)
    })));

    if (existing) {
      dbRun(
        'UPDATE daily_menus SET recipeIds = ?, totalCalories = ?, totalProtein = ?, totalFat = ?, totalCarbs = ?, updatedAt = ? WHERE id = ?',
        [JSON.stringify(recipeIds), totals.totalCalories, totals.totalProtein, totals.totalFat, totals.totalCarbs, new Date().toISOString(), existing.id]
      );
    } else {
      dbRun(
        'INSERT INTO daily_menus (id, userId, date, recipeIds, totalCalories, totalProtein, totalFat, totalCarbs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), req.user!.userId, targetDate, JSON.stringify(recipeIds), totals.totalCalories, totals.totalProtein, totals.totalFat, totals.totalCarbs]
      );
    }

    res.json({ 
      success: true, 
      date: targetDate, 
      recipeIds,
      ...totals
    });
  } catch (error) {
    console.error('Save daily menu error:', error);
    res.status(500).json({ error: '保存每日菜单失败' });
  }
});

router.delete('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    dbRun(
      'DELETE FROM daily_menus WHERE userId = ? AND date = ?',
      [req.user!.userId, targetDate]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete daily menu error:', error);
    res.status(500).json({ error: '删除每日菜单失败' });
  }
});

function calculateTotals(recipes: any[]) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  for (const recipe of recipes) {
    if (recipe.nutrition) {
      totalCalories += recipe.nutrition.calories || 0;
      totalProtein += recipe.nutrition.protein || 0;
      totalFat += recipe.nutrition.fat || 0;
      totalCarbs += recipe.nutrition.carbs || 0;
    }
  }

  return {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10
  };
}

function aggregateShoppingList(recipes: any[]) {
  const ingredientMap = new Map<string, { amount: number; unit: string; name: string }>();

  for (const recipe of recipes) {
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      for (const ing of recipe.ingredients) {
        const key = ing.name.toLowerCase().trim();
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          if (existing.unit === ing.unit) {
            existing.amount += ing.amount;
          } else {
            ingredientMap.set(key + '_' + ing.unit, {
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit
            });
          }
        } else {
          ingredientMap.set(key, {
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit
          });
        }
      }
    }
  }

  return Array.from(ingredientMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default router;
