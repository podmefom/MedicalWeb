'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Валидация
    if (!formData.name.trim()) {
      toast.error('Введите имя');
      setLoading(false);
      return;
    }

    if (!formData.email) {
      toast.error('Введите email');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Пароль должен быть минимум 6 символов');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Ошибка при регистрации');
        return;
      }

      toast.success('Регистрация успешна! Перенаправляем на вход...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      toast.error('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserPlus size={32} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-center mb-2 tracking-tight">РЕГИСТРАЦИЯ</h1>
          <p className="text-slate-500 text-center mb-8 text-sm">Создайте новый аккаунт</p>

          <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
            <div>
              <label className="text-xs font-black uppercase text-slate-600 block mb-2">
                Имя
              </label>
              <input
                type="text"
                name="name"
                placeholder="Иван Петров"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-600 block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-600 block mb-2">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-600 block mb-2">
                Подтвердите пароль
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-black text-sm uppercase rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'ЗАГРУЗКА...' : 'СОЗДАТЬ АККАУНТ'}
            </button>
          </form>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-500 text-center">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="text-green-600 font-black hover:text-green-700 underline">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
