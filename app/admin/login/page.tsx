'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) return setError('Credenciales inválidas');
    router.push('/admin/dashboard');
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={submit} className="glass rounded-3xl p-8">
        <h1 className="mb-6 text-2xl">Admin AZ Moda</h1>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" className="mb-3 w-full rounded-xl bg-white/10 p-3" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" className="mb-3 w-full rounded-xl bg-white/10 p-3" />
        {error && <p className="mb-3 text-red-300">{error}</p>}
        <button className="w-full rounded-xl bg-az-gold p-3 font-medium text-black">Ingresar</button>
      </form>
    </div>
  );
}
