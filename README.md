# AZ Moda - E-commerce Boutique

Aplicación web completa para **AZ Moda**, enfocada en ropa elegante a medida, ventas online y gestión administrativa.

## Stack
- **Frontend:** HTML5, CSS3, JavaScript moderno (responsive, estilo boutique premium).
- **Backend:** Node.js + Express.
- **Base de datos:** MongoDB con Mongoose.
- **Auth admin:** JWT.

## Funcionalidades implementadas

### Cliente
- Catálogo con búsqueda y filtros (categoría, talla, precio).
- Productos con imagen, inventario y botón de carrito.
- Carrito dinámico (editar cantidades, eliminar, calcular subtotal/total).
- Checkout con validaciones y simulación de pago.
- Generación de número de pedido único.

### Administrador
- Login protegido.
- Dashboard con:
  - ventas totales,
  - cantidad de pedidos,
  - productos con stock bajo.
- Alta de productos (incluye imágenes, tallas, colores, inventario y estado).
- API preparada para editar/eliminar productos.
- Inventario descontado automáticamente al confirmar pedidos.
- Desactivación automática de productos agotados.

## Estructura

```
public/
  css/styles.css
  js/app.js
  js/admin.js
  index.html
  admin.html
src/
  config/db.js
  controllers/
  middleware/
  models/
  routes/
  services/
server.js
```

## Configuración
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Ejecutar:
   ```bash
   npm run dev
   ```

## Endpoints principales
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/orders`
- `GET /api/orders` (admin)
- `POST /api/auth/admin/login`
- `GET /api/admin/dashboard` (admin)

## Preparado para escalabilidad
- Integración futura con Stripe/MercadoPago desde `createOrder`.
- Integración de subida de imágenes en nube (Cloudinary) reemplazando URLs directas.
- JWT ya implementado para ampliar autenticación por roles.
- Arquitectura modular por capas para crecer en microservicios si es necesario.
