import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(path.join(dataDir, 'vps-monitor.db'));
export const db = drizzle(sqlite, { schema });

// Initialize tables if they don't exist
const initializeTables = () => {
  try {
    // Check if users table exists
    const userTableExists = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    
    if (!userTableExists) {
      // Create users table
      db.run(sql`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Created users table');
    }

    // Check if vps_connections table exists
    const vpsTableExists = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='vps_connections'").get();
    
    if (!vpsTableExists) {
      // Create vps_connections table
      db.run(sql`
        CREATE TABLE vps_connections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          url TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('Created vps_connections table');
    }
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
};

// Initialize tables on module load
initializeTables();