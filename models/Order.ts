import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    items: [{ productId: String, name: String, price: Number, quantity: Number }],
    total: Number,
    status: { type: String, default: 'pendiente' }
  },
  { timestamps: true }
);

export const Order = models.Order || model('Order', OrderSchema);
