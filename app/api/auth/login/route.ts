import { NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/jwt';
import { verifyPassword } from '@/lib/password';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const adminUser = process.env.ADMIN_USERNAME;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUser || !adminHash) {
    return NextResponse.json({ message: 'Configuración de admin incompleta' }, { status: 500 });
  }

  const isValid = username === adminUser && verifyPassword(password, adminHash);
  if (!isValid) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  const token = signAdminToken({ username });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('az_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8
  });
  return res;
}
