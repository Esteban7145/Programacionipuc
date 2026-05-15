# MotoPark Pro - Sistema de Parqueadero de Motos (Colombia)

Aplicación de escritorio para Windows (también funciona en Linux) orientada a pantallas táctiles y operación rápida en recepción.

## Características incluidas

- Login con roles base (Administrador/Cajero base).
- Dashboard en tiempo real:
  - Motos parqueadas
  - Cupos disponibles
  - Ingresos del día
  - Ingresadas hoy / Retiradas hoy
  - Últimos movimientos
  - Reloj en vivo
- Ingreso de motos:
  - Placa, cliente opcional, fecha/hora automática
  - Tipo de servicio (Hora/Día/Mensualidad)
  - Cascos, locker, observaciones
  - Consecutivo de ticket automático
  - Generación de ticket de entrada (archivo listo para impresión POS)
- Salida de motos:
  - Búsqueda por placa o ticket
  - Cálculo automático de cobro
  - Método de pago (Efectivo, Nequi, Daviplata, Transferencia)
  - Ticket de salida
- Mensualidades:
  - Registro
  - Estado: Activo / Próximo a vencer / Vencido
- Lockers:
  - Vista visual por color (Disponible/Ocupado)
  - Relación con placa y cantidad de cascos
- Caja:
  - Apertura de caja
  - Arqueo diario resumido por método de pago
- Reportes:
  - Exportación histórica a CSV (abrible en Excel)
- Offline-first con SQLite.

## Tecnologías

- Python 3
- Tkinter (interfaz moderna oscura)
- SQLite

## Ejecutar

```bash
py app.py
```

Usuario inicial:
- usuario: `admin`
- contraseña: `admin123`

## Empaquetar instalador para Windows

1. Instala PyInstaller:

```bash
py -m pip install pyinstaller
```

2. Genera ejecutable:

```bash
py -m PyInstaller --noconfirm --onefile --windowed --name MotoParkPro app.py
```

El ejecutable quedará en `dist/MotoParkPro.exe`.

## Notas de impresión POS

Los tickets se generan en la carpeta `tickets/` como TXT para integrarse con impresoras térmicas de 58mm/80mm mediante el driver de Windows o spooler POS del negocio.

## Ideas de nombres modernos

- MotoPark Pro
- ParkingFlow
- MotoControl
- UrbanMoto Parking
- ParkZone Moto


## Solución a error 404 en navegador

Se agregó `server.py` con Flask para exponer una página principal en `/` y endpoint de verificación en `/health`.

### Ejecutar versión web

```bash
py -m pip install -r requirements.txt
py server.py
```

Abre: `http://localhost:8000/`


## Despliegue en Netlify (evitar 404)

Este repositorio ahora incluye una página estática raíz `index.html` para que Netlify no responda "Página no encontrada".

También se agregan reglas de fallback:
- `netlify.toml`
- `public/_redirects`

Con eso, cualquier ruta inválida redirige a `/index.html` con estado `200`.


## Ejecución en Windows (recomendado)

Si en Windows te aparece la ayuda de `py` (como la que compartiste), usa siempre el launcher así:

```bash
py app.py
```

Si no tienes Python instalado, instala una versión 3.x con:

```bash
py install 3.12
```

Verifica versiones disponibles:

```bash
py list
```

Y para forzar una versión específica:

```bash
py -3.12 app.py
```


## Impresión automática de tickets (Windows)

Al registrar **Ingreso** y **Salida**, el sistema ahora intenta imprimir automáticamente el ticket/factura en la impresora predeterminada de Windows.

Si la impresión falla, el archivo queda guardado en `tickets/` para impresión manual.


## Actualización automática (Auto-Update)

La app ahora incluye botón **Buscar actualización** en el Dashboard.

### Cómo funciona
1. Consulta un JSON remoto en `UPDATE_INFO_URL` (definido en `app.py`).
2. Si hay versión mayor, pregunta si deseas actualizar.
3. Descarga el nuevo `.exe` y reemplaza automáticamente el ejecutable actual en Windows.
4. Reinicia la app automáticamente.

### JSON esperado en tu servidor

```json
{
  "version": "1.2.0",
  "url": "https://tudominio.com/descargas/MotoParkPro.exe",
  "notes": "Mejoras en impresión y rendimiento"
}
```

> Importante: cambia `UPDATE_INFO_URL` en `app.py` por tu URL real antes de distribuir.


## Solución cuando actualizar muestra error 404

Si al pulsar **Buscar actualización** aparece 404, significa que la URL de actualizaciones no existe o no está publicada.

Ahora la app usa por defecto:

- `http://127.0.0.1:8000/update/latest.json`

Puedes cambiarla con variable de entorno en Windows antes de abrir la app:

```bat
set MOTOPARK_UPDATE_URL=https://tudominio.com/update/latest.json
MotoParkPro.exe
```

En `server.py` ya quedó una ruta de ejemplo `GET /update/latest.json` para evitar 404 en ambiente local.
