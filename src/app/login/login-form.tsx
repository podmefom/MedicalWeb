'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('[LOGIN_FORM] Попытка входа:', email);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('[LOGIN_FORM] Результат signIn:', result);

      if (result?.error) {
        console.log('[LOGIN_FORM] Ошибка:', result.error);
        toast.error('Ошибка входа', { description: result.error });
        setLoading(false);
      } else if (result?.ok) {
        console.log('[LOGIN_FORM] Успешный вход');
        toast.success('Добро пожаловать!');
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error('[LOGIN_FORM] Ошибка сети:', err);
      toast.error('Ошибка сети');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-blue-100 rounded-lg">
              <LogIn size={32} className="text-blue-600" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-center mb-2 tracking-tight">ВХОД</h1>
          <p className="text-slate-500 text-center mb-8 text-sm">Медицинская клиника</p>

          <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
            <div>
              <label className="text-xs font-black uppercase text-slate-600 block mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-3 border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-600 block mb-2">
                Пароль
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-black text-sm uppercase rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'ЗАГРУЗКА...' : 'ВОЙТИ'}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600">
            Нет аккаунта? 
            <a href="/register" className="text-blue-600 font-semibold hover:text-blue-700 ml-1">
              Зарегистрируйтесь
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
