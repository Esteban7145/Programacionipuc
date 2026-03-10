import { Schema, model, models } from 'mongoose';

const verseSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    reference: { type: String, required: true },
    text: { type: String, required: true },
    version: { type: String, default: 'RVR1960' },
    favorite: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Verse = models.Verse || model('Verse', verseSchema);
