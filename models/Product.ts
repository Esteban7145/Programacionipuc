import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String, required: true }],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sold: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Product = models.Product || model('Product', ProductSchema);
