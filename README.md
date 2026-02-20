# AZ Moda - Tienda online futurista

Ecommerce premium con **Next.js App Router**, **MongoDB**, **Tailwind CSS**, **Framer Motion**, **Cloudinary**, autenticación **JWT** y panel admin visual.

## Funcionalidades incluidas

- Home impactante, oscura, elegante y animada.
- Catálogo con filtros dinámicos.
- Página de producto con galería, selección de talla/color y stock.
- Carrito en tiempo real con resumen de checkout.
- API de pedidos lista para integrar Stripe y MercadoPago.
- Login admin seguro vía variables de entorno + hash de contraseña.
- Panel CMS simple para crear, editar, activar/desactivar y eliminar productos.
- Dashboard admin con ventas, bajo stock, pedidos recientes y gráfica animada.
- Drag & drop de imágenes directo a Cloudinary.
- Middleware para proteger rutas administrativas.

## Variables de entorno

Copia `.env.example` a `.env.local`.

## Ejecutar

```bash
npm install
npm run dev
```

## Seguridad

- Credenciales administrativas no se exponen al frontend.
- Token JWT HTTP-only.
- Verificación de contraseña con hash y comparación segura.
- Validaciones backend con Zod para creación de productos.
