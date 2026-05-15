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
python app.py
```

Usuario inicial:
- usuario: `admin`
- contraseña: `admin123`

## Empaquetar instalador para Windows

1. Instala PyInstaller:

```bash
pip install pyinstaller
```

2. Genera ejecutable:

```bash
pyinstaller --noconfirm --onefile --windowed --name MotoParkPro app.py
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
