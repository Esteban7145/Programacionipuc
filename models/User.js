import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['ADMIN_GENERAL', 'LIDER_DECOM', 'OPERADOR'], required: true }
  },
  { timestamps: true }
);

export const User = models.User || model('User', userSchema);
