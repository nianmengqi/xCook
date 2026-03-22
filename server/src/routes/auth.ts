import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { dbGet, dbRun, saveDb } from '../db';
import { generateToken, AuthRequest, authMiddleware } from '../middleware/auth';
import { config } from '../config';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 255;
const MAX_PASSWORD_LENGTH = 128;
const MAX_DISPLAY_NAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 6;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `密码长度至少为${MIN_PASSWORD_LENGTH}位` };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, error: `密码长度不能超过${MAX_PASSWORD_LENGTH}位` };
  }
  return { valid: true };
}

function validateDisplayName(name: string): { valid: boolean; error?: string } {
  if (name.length > MAX_DISPLAY_NAME_LENGTH) {
    return { valid: false, error: `昵称长度不能超过${MAX_DISPLAY_NAME_LENGTH}位` };
  }
  return { valid: true };
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000);
}

router.post('/register', async (req, res) => {
  try {
    const email = sanitizeInput(req.body.email || '');
    const password = req.body.password || '';
    const displayName = sanitizeInput(req.body.displayName || '');

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: '请输入有效的邮箱地址' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    if (displayName) {
      const nameValidation = validateDisplayName(displayName);
      if (!nameValidation.valid) {
        return res.status(400).json({ error: nameValidation.error });
      }
    }

    const existingUser = dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ error: '该邮箱已被注册' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userId = uuidv4();
    const now = new Date().toISOString();
    
    dbRun(
      'INSERT INTO users (id, email, password, displayName, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, hashedPassword, displayName || null, now, now]
    );
    saveDb();

    const token = generateToken(userId, email);

    res.status(201).json({
      token,
      user: {
        uid: userId,
        email,
        displayName: displayName || null,
      },
    });
  } catch (error) {
    console.error('Register error');
    res.status(500).json({ error: '注册失败' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = sanitizeInput(req.body.email || '');
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    if (!validateEmail(email)) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(404).json({ error: '用户不存在', code: 'USER_NOT_FOUND' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '密码错误', code: 'INVALID_PASSWORD' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      token,
      user: {
        uid: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error('Login error');
    res.status(500).json({ error: '登录失败' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = dbGet('SELECT id, email, displayName, photoURL FROM users WHERE id = ?', [req.user!.userId]);
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      uid: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  } catch (error) {
    console.error('Get user error');
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

export default router;
