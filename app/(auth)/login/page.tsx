'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@ipuc.local');
  const [password, setPassword] = useState('123456');
  const [tenantCode, setTenantCode] = useState('ipuc-central');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, tenantCode })
    });
    const data = await res.json();
    setMessage(data.message ?? 'Inicio de sesión exitoso');
  };

  return (
    <main className="container">
      <form className="glass grid" style={{ padding: 24, maxWidth: 420 }} onSubmit={onSubmit}>
        <h2>Ingreso IPUC Proyección</h2>
        <input value={tenantCode} onChange={(e) => setTenantCode(e.target.value)} placeholder="Código de iglesia" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" type="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
        <button type="submit">Entrar</button>
        <small>{message}</small>
      </form>
    </main>
  );
}
