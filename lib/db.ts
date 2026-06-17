import Database from 'better-sqlite3';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

const DB_PATH = resolve(process.cwd(), 'parking.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  _db.exec(`
    CREATE TABLE IF NOT EXISTS zones (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      coordinates TEXT NOT NULL,
      color TEXT NOT NULL,
      tariffs TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      licensePlate TEXT NOT NULL,
      zoneId TEXT NOT NULL,
      entryTime TEXT NOT NULL,
      exitTime TEXT,
      ticketBoughtTime TEXT,
      ticketDuration INTEGER,
      ticketPrice REAL,
      hasPCN INTEGER NOT NULL DEFAULT 0
    );
  `);

  seedIfEmpty(_db);

  return _db;
}

function seedIfEmpty(db: Database.Database) {
  const zoneCount = (db.prepare('SELECT COUNT(*) as n FROM zones').get() as { n: number }).n;
  if (zoneCount === 0) {
    const zonesPath = resolve(process.cwd(), 'zones.json');
    if (existsSync(zonesPath)) {
      const zones = JSON.parse(readFileSync(zonesPath, 'utf-8'));
      const insert = db.prepare(
        'INSERT OR IGNORE INTO zones (id, name, coordinates, color, tariffs) VALUES (?, ?, ?, ?, ?)'
      );
      const insertMany = db.transaction((rows: typeof zones) => {
        for (const z of rows) {
          insert.run(z.id, z.name, JSON.stringify(z.coordinates), z.color, JSON.stringify(z.tariffs));
        }
      });
      insertMany(zones);
    }
  }

  const carCount = (db.prepare('SELECT COUNT(*) as n FROM cars').get() as { n: number }).n;
  if (carCount === 0) {
    const carsPath = resolve(process.cwd(), 'cars.json');
    if (existsSync(carsPath)) {
      const cars = JSON.parse(readFileSync(carsPath, 'utf-8'));
      const insert = db.prepare(`
        INSERT OR IGNORE INTO cars
          (id, licensePlate, zoneId, entryTime, exitTime, ticketBoughtTime, ticketDuration, ticketPrice, hasPCN)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertMany = db.transaction((rows: typeof cars) => {
        for (const c of rows) {
          insert.run(
            c.id, c.licensePlate, c.zoneId, c.entryTime,
            c.exitTime ?? null, c.ticketBoughtTime ?? null,
            c.ticketDuration ?? null, c.ticketPrice ?? null,
            c.hasPCN ? 1 : 0
          );
        }
      });
      insertMany(cars);
    }
  }
}

export function deserializeCar(row: Record<string, unknown>) {
  return {
    ...row,
    hasPCN: Boolean(row.hasPCN),
  };
}

export function deserializeZone(row: Record<string, unknown>) {
  return {
    ...row,
    coordinates: JSON.parse(row.coordinates as string),
    tariffs: JSON.parse(row.tariffs as string),
  };
}
