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

Copia `.env.example` a `.env.local` y completa los datos reales.

## Ejecutar en local

```bash
npm install
npm run dev
```

## Deploy en Netlify (evita error 404)

Este repositorio ya incluye `netlify.toml` con el runtime oficial de Next.js. Para que funcione correctamente en Netlify:

1. Build command: `npm run build`
2. Publish directory: **dejar vacío** (Netlify lo resuelve con el plugin de Next)
3. Configurar variables de entorno del `.env.example` en Site settings → Environment variables.
4. Redeploy del sitio.

Si faltan variables (`MONGODB_URI`, `JWT_SECRET`, Cloudinary, etc.), las páginas/API pueden fallar en runtime.

## Seguridad

- Credenciales administrativas no se exponen al frontend.
- Token JWT HTTP-only.
- Verificación de contraseña con hash y comparación segura.
- Validaciones backend con Zod para creación de productos.
