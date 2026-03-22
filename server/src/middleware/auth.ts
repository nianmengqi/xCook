import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '无效的认证令牌' });
  }
}

export function generateToken(userId: string, email: string): string {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ userId, email }, config.jwt.secret, options);
}
