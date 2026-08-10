'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push(searchParams.get('from') || '/');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Koha Foods</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
          required
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}