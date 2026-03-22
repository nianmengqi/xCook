import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { dbGet, dbAll, dbRun } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { config } from '../config';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const foods = dbAll('SELECT * FROM food_items ORDER BY name');
    
    res.json(foods.map(food => ({
      name: food.name,
      nutrients: JSON.parse(food.nutrients),
      isCustom: Boolean(food.isCustom),
      createdBy: food.createdBy,
      createdAt: food.createdAt,
      updatedAt: food.updatedAt,
    })));
  } catch (error) {
    console.error('Get foods error');
    res.status(500).json({ error: '获取食材数据失败' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    let foods;
    if (q && typeof q === 'string' && q.trim()) {
      const searchTerm = q.trim().slice(0, 100);
      foods = dbAll(
        'SELECT * FROM food_items WHERE name LIKE ? ORDER BY name LIMIT 50',
        [`%${searchTerm}%`]
      );
    } else {
      foods = dbAll('SELECT * FROM food_items ORDER BY name LIMIT 100');
    }
    
    res.json(foods.map(food => ({
      name: food.name,
      nutrients: JSON.parse(food.nutrients),
      isCustom: Boolean(food.isCustom),
    })));
  } catch (error) {
    console.error('Search foods error');
    res.status(500).json({ error: '搜索食材失败' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, nutrients } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: '食材名称不能为空' });
    }
    
    if (name.length > 100) {
      return res.status(400).json({ error: '食材名称过长' });
    }
    
    if (!nutrients || typeof nutrients !== 'object') {
      return res.status(400).json({ error: '营养数据不能为空' });
    }
    
    const foodName = name.trim();
    const existing = dbGet('SELECT name FROM food_items WHERE name = ?', [foodName]);
    if (existing) {
      return res.status(409).json({ error: '该食材已存在' });
    }
    
    const now = new Date().toISOString();
    dbRun(
      'INSERT INTO food_items (name, nutrients, isCustom, createdBy, createdAt, updatedAt) VALUES (?, ?, 1, ?, ?, ?)',
      [foodName, JSON.stringify(nutrients), req.user!.userId, now, now]
    );
    
    const newFood = dbGet('SELECT * FROM food_items WHERE name = ?', [foodName]);
    res.status(201).json({
      name: newFood.name,
      nutrients: JSON.parse(newFood.nutrients),
      isCustom: Boolean(newFood.isCustom),
    });
  } catch (error) {
    console.error('Add food error');
    res.status(500).json({ error: '添加食材失败' });
  }
});

router.put('/:name', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { nutrients } = req.body;
    const foodName = decodeURIComponent(req.params.name);
    
    if (!nutrients || typeof nutrients !== 'object') {
      return res.status(400).json({ error: '营养数据不能为空' });
    }
    
    const existing = dbGet('SELECT * FROM food_items WHERE name = ?', [foodName]);
    if (!existing) {
      return res.status(404).json({ error: '食材不存在' });
    }
    
    dbRun(
      'UPDATE food_items SET nutrients = ?, updatedAt = ? WHERE name = ?',
      [JSON.stringify(nutrients), new Date().toISOString(), foodName]
    );
    
    const updated = dbGet('SELECT * FROM food_items WHERE name = ?', [foodName]);
    res.json({
      name: updated.name,
      nutrients: JSON.parse(updated.nutrients),
      isCustom: Boolean(updated.isCustom),
    });
  } catch (error) {
    console.error('Update food error');
    res.status(500).json({ error: '更新食材失败' });
  }
});

router.delete('/:name', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const foodName = decodeURIComponent(req.params.name);
    
    const existing = dbGet('SELECT * FROM food_items WHERE name = ?', [foodName]);
    if (!existing) {
      return res.status(404).json({ error: '食材不存在' });
    }
    
    dbRun('DELETE FROM food_items WHERE name = ?', [foodName]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete food error');
    res.status(500).json({ error: '删除食材失败' });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: '请输入密码' });
    }
    
    const adminPassword = config.admin.password;
    const adminHash = config.admin.passwordHash;
    
    if (!adminPassword && !adminHash) {
      return res.status(500).json({ error: '管理员密码未配置，请在 .env 文件中设置 ADMIN_PASSWORD' });
    }
    
    let isValid = false;
    
    if (adminPassword) {
      isValid = password === adminPassword;
    }
    
    if (!isValid && adminHash) {
      isValid = await bcrypt.compare(password, adminHash);
    }
    
    if (!isValid) {
      return res.status(401).json({ error: '密码错误' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Admin login error');
    res.status(500).json({ error: '登录失败' });
  }
});

export default router;
