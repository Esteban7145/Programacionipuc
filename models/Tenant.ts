import { Schema, model, models } from 'mongoose';

const tenantSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    logoUrl: String,
    theme: {
      primary: { type: String, default: '#3e7bff' },
      accent: { type: String, default: '#b9964e' },
      font: { type: String, default: 'Inter' },
      animationPreset: { type: String, default: 'cinematic-fade' }
    }
  },
  { timestamps: true }
);

export const Tenant = models.Tenant || model('Tenant', tenantSchema);
