import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Tenant } from '@/models/Tenant';
import { User } from '@/models/User';

const schema = z.object({
  churchName: z.string().min(3),
  tenantCode: z.string().min(3),
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req) {
  await connectDB();
  const data = schema.parse(await req.json());

  const tenant = await Tenant.create({ name: data.churchName, code: data.tenantCode });
  const passwordHash = await bcrypt.hash(data.password, 10);

  await User.create({ tenantId: tenant._id, email: data.email, name: data.name, passwordHash, role: 'ADMIN_GENERAL' });

  return NextResponse.json({ message: 'Iglesia registrada exitosamente.' }, { status: 201 });
}
