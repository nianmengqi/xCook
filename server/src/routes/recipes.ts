import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { dbGet, dbAll, dbRun } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { config } from '../config';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const recipes = dbAll(
      'SELECT * FROM recipes WHERE userId = ? OR isPublic = 1 ORDER BY createdAt DESC',
      [req.user!.userId]
    );
    
    const favorites = dbAll('SELECT recipeId FROM user_favorites WHERE userId = ?', [req.user!.userId]);
    const favoriteIds = new Set(favorites.map((f: any) => f.recipeId));

    res.json(recipes.map(recipe => ({
      ...recipe,
      tags: JSON.parse(recipe.tags),
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps),
      nutrition: JSON.parse(recipe.nutrition),
      isPublic: Boolean(recipe.isPublic),
      isFavorite: favoriteIds.has(recipe.id),
      rating: recipe.rating || 0,
      ratingCount: recipe.ratingCount || 0,
      isOwner: recipe.userId === req.user!.userId,
    })));
  } catch (error) {
    console.error('Get recipes error');
    res.status(500).json({ error: '获取菜谱失败' });
  }
});

router.get('/public', async (req, res) => {
  try {
    const recipes = dbAll('SELECT r.*, u.displayName as authorName FROM recipes r JOIN users u ON r.userId = u.id WHERE r.isPublic = 1 ORDER BY r.createdAt DESC LIMIT 100');

    res.json(recipes.map(recipe => ({
      ...recipe,
      tags: JSON.parse(recipe.tags),
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps),
      nutrition: JSON.parse(recipe.nutrition),
      isPublic: Boolean(recipe.isPublic),
      isFavorite: Boolean(recipe.isFavorite),
      rating: recipe.rating || 0,
      ratingCount: recipe.ratingCount || 0,
    })));
  } catch (error) {
    console.error('Get public recipes error');
    res.status(500).json({ error: '获取菜谱失败' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = dbGet('SELECT * FROM recipes WHERE id = ?', [req.params.id]);

    if (!recipe) {
      return res.status(404).json({ error: '菜谱不存在' });
    }

    const authHeader = req.headers.authorization;
    let isOwner = false;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        isOwner = decoded.userId === recipe.userId;
      } catch (e) {
        // Invalid token, ignore
      }
    }

    if (!recipe.isPublic && !isOwner) {
      return res.status(403).json({ error: '无权访问该菜谱' });
    }

    res.json({
      ...recipe,
      tags: JSON.parse(recipe.tags),
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps),
      nutrition: JSON.parse(recipe.nutrition),
      isPublic: Boolean(recipe.isPublic),
      isFavorite: Boolean(recipe.isFavorite),
      isOwner,
      rating: recipe.rating || 0,
      ratingCount: recipe.ratingCount || 0,
    });
  } catch (error) {
    console.error('Get recipe error');
    res.status(500).json({ error: '获取菜谱失败' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      coverImage,
      category,
      tags,
      difficulty,
      prepTime,
      cookTime,
      servings,
      ingredients,
      steps,
      nutrition,
      isPublic,
    } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: '菜谱标题不能为空' });
    }

    if (title.length > 100) {
      return res.status(400).json({ error: '菜谱标题不能超过100个字符' });
    }

    const recipeId = uuidv4();
    const now = new Date().toISOString();

    dbRun(
      `INSERT INTO recipes (
        id, userId, title, description, coverImage, category, tags, difficulty,
        prepTime, cookTime, servings, ingredients, steps, nutrition, isPublic, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipeId,
        req.user!.userId,
        title.trim(),
        description?.slice(0, 1000) || null,
        coverImage || '',
        category || 'hot-dish',
        JSON.stringify(tags || []),
        difficulty || 'easy',
        prepTime || 0,
        cookTime || 0,
        servings || 2,
        JSON.stringify(ingredients || []),
        JSON.stringify(steps || []),
        JSON.stringify(nutrition || { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0, zinc: 0 }),
        isPublic ? 1 : 0,
        now,
        now,
      ]
    );

    const newRecipe = dbGet('SELECT * FROM recipes WHERE id = ?', [recipeId]);
    res.status(201).json({
      ...newRecipe,
      tags: JSON.parse(newRecipe.tags),
      ingredients: JSON.parse(newRecipe.ingredients),
      steps: JSON.parse(newRecipe.steps),
      nutrition: JSON.parse(newRecipe.nutrition),
      isPublic: Boolean(newRecipe.isPublic),
      isFavorite: Boolean(newRecipe.isFavorite),
      isOwner: true,
    });
  } catch (error) {
    console.error('Create recipe error');
    res.status(500).json({ error: '创建菜谱失败' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const existing = dbGet('SELECT userId FROM recipes WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: '菜谱不存在' });
    }
    if (existing.userId !== req.user!.userId) {
      return res.status(403).json({ error: '无权修改该菜谱' });
    }

    const updates = req.body;
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) { 
      if (!updates.title || updates.title.trim().length === 0) {
        return res.status(400).json({ error: '菜谱标题不能为空' });
      }
      if (updates.title.length > 100) {
        return res.status(400).json({ error: '菜谱标题不能超过100个字符' });
      }
      fields.push('title = ?'); 
      values.push(updates.title.trim()); 
    }
    if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description?.slice(0, 1000) || null); }
    if (updates.coverImage !== undefined) { fields.push('coverImage = ?'); values.push(updates.coverImage); }
    if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }
    if (updates.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(updates.tags)); }
    if (updates.difficulty !== undefined) { fields.push('difficulty = ?'); values.push(updates.difficulty); }
    if (updates.prepTime !== undefined) { fields.push('prepTime = ?'); values.push(updates.prepTime); }
    if (updates.cookTime !== undefined) { fields.push('cookTime = ?'); values.push(updates.cookTime); }
    if (updates.servings !== undefined) { fields.push('servings = ?'); values.push(updates.servings); }
    if (updates.ingredients !== undefined) { fields.push('ingredients = ?'); values.push(JSON.stringify(updates.ingredients)); }
    if (updates.steps !== undefined) { fields.push('steps = ?'); values.push(JSON.stringify(updates.steps)); }
    if (updates.nutrition !== undefined) { fields.push('nutrition = ?'); values.push(JSON.stringify(updates.nutrition)); }
    if (updates.isPublic !== undefined) { fields.push('isPublic = ?'); values.push(updates.isPublic ? 1 : 0); }
    if (updates.isFavorite !== undefined) { fields.push('isFavorite = ?'); values.push(updates.isFavorite ? 1 : 0); }

    if (fields.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }

    fields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(req.params.id);

    dbRun(`UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`, values);

    const updated = dbGet('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
    res.json({
      ...updated,
      tags: JSON.parse(updated.tags),
      ingredients: JSON.parse(updated.ingredients),
      steps: JSON.parse(updated.steps),
      nutrition: JSON.parse(updated.nutrition),
      isPublic: Boolean(updated.isPublic),
      isFavorite: Boolean(updated.isFavorite),
    });
  } catch (error) {
    console.error('Update recipe error');
    res.status(500).json({ error: '更新菜谱失败' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const existing = dbGet('SELECT userId FROM recipes WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: '菜谱不存在' });
    }
    if (existing.userId !== req.user!.userId) {
      return res.status(403).json({ error: '无权删除该菜谱' });
    }

    dbRun('DELETE FROM recipes WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete recipe error');
    res.status(500).json({ error: '删除菜谱失败' });
  }
});

router.post('/:id/rate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { rating } = req.body;
    const recipeId = req.params.id;
    const userId = req.user!.userId;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: '评分必须在1-5之间' });
    }
    
    const recipe = dbGet('SELECT * FROM recipes WHERE id = ?', [recipeId]);
    if (!recipe) {
      return res.status(404).json({ error: '菜谱不存在' });
    }
    
    const existingRating = dbGet('SELECT * FROM recipe_ratings WHERE recipeId = ? AND userId = ?', [recipeId, userId]);
    
    if (existingRating) {
      dbRun('UPDATE recipe_ratings SET rating = ? WHERE id = ?', [rating, existingRating.id]);
    } else {
      const ratingId = uuidv4();
      dbRun('INSERT INTO recipe_ratings (id, recipeId, userId, rating) VALUES (?, ?, ?, ?)', [ratingId, recipeId, userId, rating]);
    }
    
    const ratings = dbAll('SELECT rating FROM recipe_ratings WHERE recipeId = ?', [recipeId]);
    
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;
    
    dbRun('UPDATE recipes SET rating = ?, ratingCount = ? WHERE id = ?', [avgRating, ratings.length, recipeId]);
    
    res.json({ 
      success: true, 
      rating: avgRating, 
      ratingCount: ratings.length,
      userRating: rating 
    });
  } catch (error) {
    console.error('Rate recipe error');
    res.status(500).json({ error: '评分失败' });
  }
});

router.get('/:id/rating', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user!.userId;
    
    const rating = dbGet('SELECT rating FROM recipe_ratings WHERE recipeId = ? AND userId = ?', [recipeId, userId]);
    
    res.json({ 
      userRating: rating ? rating.rating : null 
    });
  } catch (error) {
    console.error('Get rating error');
    res.status(500).json({ error: '获取评分失败' });
  }
});

router.post('/:id/favorite', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user!.userId;
    
    const recipe = dbGet('SELECT id FROM recipes WHERE id = ?', [recipeId]);
    if (!recipe) {
      return res.status(404).json({ error: '菜谱不存在' });
    }
    
    const existing = dbGet('SELECT * FROM user_favorites WHERE recipeId = ? AND userId = ?', [recipeId, userId]);
    
    if (existing) {
      dbRun('DELETE FROM user_favorites WHERE id = ?', [existing.id]);
      res.json({ success: true, isFavorite: false });
    } else {
      const favoriteId = uuidv4();
      dbRun('INSERT INTO user_favorites (id, recipeId, userId) VALUES (?, ?, ?)', [favoriteId, recipeId, userId]);
      res.json({ success: true, isFavorite: true });
    }
  } catch (error) {
    console.error('Toggle favorite error');
    res.status(500).json({ error: '操作失败' });
  }
});

export default router;
