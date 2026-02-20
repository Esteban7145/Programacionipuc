export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  sold: number;
};

export type CartItem = Product & { quantity: number; selectedColor?: string; selectedSize?: string };
