import { Schema, model, models } from 'mongoose';

const presentationSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['SONG', 'VERSE', 'SPECIAL', 'MIXED'], default: 'MIXED' },
    slides: [{ type: String, required: true }],
    scheduleAt: Date
  },
  { timestamps: true }
);

export const Presentation = models.Presentation || model('Presentation', presentationSchema);
