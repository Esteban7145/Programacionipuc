import crypto from 'crypto';

export function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, 'hex');
  const derived = crypto.scryptSync(password, salt, 32) as Buffer;
  const hash = Buffer.from(hashHex, 'hex');
  if (derived.length !== hash.length) return false;
  return crypto.timingSafeEqual(derived, hash);
}
