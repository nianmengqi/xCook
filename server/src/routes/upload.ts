import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { config } from '../config';

const router = Router();

const uploadDir = config.upload.dir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const FILE_SIGNATURES: Record<string, Buffer[]> = {
  'image/jpeg': [
    Buffer.from([0xFF, 0xD8, 0xFF]),
  ],
  'image/png': [
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  ],
  'image/gif': [
    Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]),
    Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]),
  ],
  'image/webp': [
    Buffer.from([0x52, 0x49, 0x46, 0x46]),
  ],
};

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function validateFileSignature(buffer: Buffer, mimeType: string): boolean {
  const signatures = FILE_SIGNATURES[mimeType];
  if (!signatures) return false;
  
  return signatures.some(sig => buffer.slice(0, sig.length).equals(sig));
}

function sanitizeFilename(filename: string): string {
  const safeName = path.basename(filename);
  return safeName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
}

function isValidExtension(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = sanitizeFilename(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(safeName);
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('只支持 JPG、PNG、GIF、WebP 格式的图片'));
  }
  
  if (!isValidExtension(file.originalname)) {
    return cb(new Error('文件扩展名不被允许'));
  }
  
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  }
});

router.post('/image', authMiddleware, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    
    if (!validateFileSignature(buffer, req.file.mimetype)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: '文件内容与类型不匹配' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Upload error');
    res.status(500).json({ error: '上传失败' });
  }
});

router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: '无效的文件名' });
  }
  
  const safeName = sanitizeFilename(filename);
  const filePath = path.join(uploadDir, safeName);
  
  const resolvedPath = path.resolve(filePath);
  const resolvedUploadDir = path.resolve(uploadDir);
  
  if (!resolvedPath.startsWith(resolvedUploadDir)) {
    return res.status(403).json({ error: '禁止访问' });
  }
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }
  
  const ext = path.extname(safeName).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  
  const contentType = contentTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  res.sendFile(resolvedPath);
});

export default router;
