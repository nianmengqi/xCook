import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

function getEnvVar(name: string, required: boolean = true): string {
  const value = process.env[name];
  if (!value && required) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value || '';
}

function getEnvVarWithDefault(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

function generateJwtSecret(): string {
  const secret = crypto.randomBytes(64).toString('hex');
  console.log('');
  console.log('========================================');
  console.log('  自动生成的 JWT_SECRET:');
  console.log(`  ${secret}`);
  console.log('  建议将此值保存到 .env 文件中');
  console.log('========================================');
  console.log('');
  return secret;
}

export const config = {
  jwt: {
    secret: getEnvVarWithDefault('JWT_SECRET', '') || generateJwtSecret(),
    expiresIn: getEnvVarWithDefault('JWT_EXPIRES_IN', '7d'),
  },
  
  server: {
    port: parseInt(getEnvVarWithDefault('PORT', '3001')),
    nodeEnv: getEnvVarWithDefault('NODE_ENV', 'development'),
    corsOrigins: getEnvVarWithDefault('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(','),
  },
  
  upload: {
    dir: getEnvVarWithDefault('UPLOAD_DIR', 'uploads'),
    maxFileSize: parseInt(getEnvVarWithDefault('MAX_FILE_SIZE', '5242880')),
  },
  
  admin: {
    password: getEnvVarWithDefault('ADMIN_PASSWORD', ''),
    passwordHash: getEnvVarWithDefault('ADMIN_PASSWORD_HASH', ''),
  },
  
  rateLimit: {
    windowMs: parseInt(getEnvVarWithDefault('RATE_LIMIT_WINDOW_MS', '900000')),
    maxRequests: parseInt(getEnvVarWithDefault('RATE_LIMIT_MAX', '100')),
    authMaxRequests: parseInt(getEnvVarWithDefault('RATE_LIMIT_AUTH_MAX', '10')),
  },
};

export function validateConfig(): void {
  if (config.server.nodeEnv === 'production') {
    if (config.jwt.secret.length < 32) {
      console.error('JWT_SECRET must be at least 32 characters in production');
      process.exit(1);
    }
    
    if (config.server.corsOrigins.some(origin => origin.includes('localhost'))) {
      console.warn('Warning: localhost CORS origins detected in production');
    }
    
    if (!config.admin.password && !config.admin.passwordHash) {
      console.warn('Warning: ADMIN_PASSWORD not set, admin features will be disabled');
    }
  }
}

validateConfig();
