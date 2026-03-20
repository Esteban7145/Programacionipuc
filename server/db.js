import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'db.json');
const defaultUsers = [
  {
    id: 'principal-esteban',
    username: 'ESTEBAN',
    password: '1013689193',
    role: 'principal',
    created_at: new Date().toISOString(),
  },
];

const ensureDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({ schedules: [], invitations: [], users: defaultUsers }, null, 2));
  }
};

export const readDb = () => {
  ensureDb();
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (!Array.isArray(data.users) || data.users.length === 0) {
    data.users = defaultUsers;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }
  return data;
};

export const writeDb = (data) => {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};
