import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'db.json');

const ensureDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({ schedules: [], invitations: [] }, null, 2));
  }
};

export const readDb = () => {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};

export const writeDb = (data) => {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};
