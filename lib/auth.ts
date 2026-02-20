import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'ipuc-dev-secret';

export type AuthPayload = {
  userId: string;
  tenantId: string;
  role: 'ADMIN_GENERAL' | 'LIDER_DECOM' | 'OPERADOR';
};

export const signToken = (payload: AuthPayload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET) as AuthPayload;
