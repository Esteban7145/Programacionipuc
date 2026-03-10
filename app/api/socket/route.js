import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de handshake para tiempo real. Configurar Socket.IO/WS en despliegue dedicado.',
    channels: ['presentation:update', 'operator:control', 'verse:change']
  });
}
