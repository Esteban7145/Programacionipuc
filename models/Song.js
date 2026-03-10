import { Schema, model, models } from 'mongoose';

const songSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    title: { type: String, required: true },
    stanzas: [{ type: String, required: true }],
    slides: [{ type: String, required: true }],
    tags: [String]
  },
  { timestamps: true }
);

export const Song = models.Song || model('Song', songSchema);
