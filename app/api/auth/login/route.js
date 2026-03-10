import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { signToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Tenant } from '@/models/Tenant';
import { User } from '@/models/User';

const schema = z.object({
  tenantCode: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req) {
  await connectDB();
  const data = schema.parse(await req.json());

  const tenant = await Tenant.findOne({ code: data.tenantCode });
  if (!tenant) return NextResponse.json({ message: 'Iglesia no encontrada' }, { status: 404 });

  const user = await User.findOne({ email: data.email, tenantId: tenant._id });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  const token = signToken({ userId: String(user._id), tenantId: String(tenant._id), role: user.role });

  return NextResponse.json({ message: 'Inicio de sesión exitoso', token });
}
