import initSqlJs, { Database } from 'sql.js';
import * as fs from 'fs';
import * as path from 'path';

let db: Database | null = null;
let SQL: any = null;
const DB_PATH = path.join(process.cwd(), 'data', 'xcook.db');

export async function getDb(): Promise<Database> {
  if (!db) {
    SQL = await initSqlJs();
    
    // Try to load existing database
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  }
  return db!;
}

export function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, buffer);
  }
}

export async function initDb() {
  const database = await getDb();

  // Create users table
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      displayName TEXT,
      photoURL TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create recipes table
  database.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      coverImage TEXT,
      category TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      difficulty TEXT NOT NULL,
      prepTime INTEGER DEFAULT 0,
      cookTime INTEGER DEFAULT 0,
      servings INTEGER DEFAULT 2,
      ingredients TEXT NOT NULL,
      steps TEXT NOT NULL,
      nutrition TEXT NOT NULL,
      isPublic INTEGER DEFAULT 1,
      isFavorite INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      ratingCount INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Migration: Add rating columns if they don't exist
  try {
    const columns = database.run("PRAGMA table_info(recipes)");
    const stmt = database.prepare("PRAGMA table_info(recipes)");
    const existingColumns: string[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      existingColumns.push(row.name as string);
    }
    stmt.free();
    
    if (!existingColumns.includes('rating')) {
      console.log('Adding rating column to recipes table...');
      database.run('ALTER TABLE recipes ADD COLUMN rating REAL DEFAULT 0');
    }
    if (!existingColumns.includes('ratingCount')) {
      console.log('Adding ratingCount column to recipes table...');
      database.run('ALTER TABLE recipes ADD COLUMN ratingCount INTEGER DEFAULT 0');
    }
  } catch (e) {
    console.log('Migration check skipped or failed:', e);
  }

  // Create recipe_ratings table for user ratings
  database.run(`
    CREATE TABLE IF NOT EXISTS recipe_ratings (
      id TEXT PRIMARY KEY,
      recipeId TEXT NOT NULL,
      userId TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(recipeId, userId)
    )
  `);

  // Create user_favorites table for user-specific favorites
  database.run(`
    CREATE TABLE IF NOT EXISTS user_favorites (
      id TEXT PRIMARY KEY,
      recipeId TEXT NOT NULL,
      userId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(recipeId, userId)
    )
  `);

  // Create food_items table
  database.run(`
    CREATE TABLE IF NOT EXISTS food_items (
      name TEXT PRIMARY KEY,
      nutrients TEXT NOT NULL,
      isCustom INTEGER DEFAULT 0,
      createdBy TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Create daily_menus table
  database.run(`
    CREATE TABLE IF NOT EXISTS daily_menus (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      date TEXT NOT NULL,
      recipeIds TEXT DEFAULT '[]',
      totalCalories INTEGER DEFAULT 0,
      totalProtein REAL DEFAULT 0,
      totalFat REAL DEFAULT 0,
      totalCarbs REAL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(userId, date)
    )
  `);

  saveDb();
  console.log('Database initialized successfully');
  return database;
}

export async function closeDb() {
  if (db) {
    saveDb();
    db.close();
    db = null;
  }
}

// Helper functions for database operations
export function dbGet(sql: string, params: any[] = []): any {
  const database = db;
  if (!database) throw new Error('Database not initialized');
  
  const stmt = database.prepare(sql);
  stmt.bind(params);
  
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

export function dbAll(sql: string, params: any[] = []): any[] {
  const database = db;
  if (!database) throw new Error('Database not initialized');
  
  const results: any[] = [];
  const stmt = database.prepare(sql);
  stmt.bind(params);
  
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function dbRun(sql: string, params: any[] = []): { changes: number; lastInsertRowId: number } {
  const database = db;
  if (!database) throw new Error('Database not initialized');
  
  database.run(sql, params);
  saveDb();
  
  return {
    changes: database.getRowsModified(),
    lastInsertRowId: 0 // sql.js doesn't directly expose this
  };
}
