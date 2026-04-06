'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, Calendar, LogOut, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  date: string;
  status: string;
  patient: {
    name: string;
    email: string;
  };
  doctor: {
    user: {
      name: string;
      email: string;
    };
    specialty: string;
  };
  patientPhone: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'users'>('appointments');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      if (userRole !== 'ADMIN') {
        toast.error('У вас нет доступа к админ-панели');
        router.push('/dashboard');
        return;
      }
      loadData();
    }
  }, [status, session]);

  const loadData = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      toast.error('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      });

      if (response.ok) {
        toast.success('Запись подтверждена');
        await loadData();
      }
    } catch (error) {
      toast.error('Ошибка при подтверждении');
    }
  };

  const handleDelete = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Запись удалена');
        await loadData();
      }
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
        <div className="animate-pulse">Загрузка...</div>
      </main>
    );
  }

  if (!session?.user || (session.user as any)?.role !== 'ADMIN') {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      CONFIRMED: 'Подтверждена',
      PENDING: 'Ожидает подтверждения',
      COMPLETED: 'Завершена',
      CANCELLED: 'Отменена',
    };
    return labels[status] || status;
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2 uppercase">
            АДМИН-ПАНЕЛЬ
          </h1>
          <p className="text-slate-500 font-medium">Управление клиникой и записями</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-black text-sm uppercase rounded transition ${
              activeTab === 'appointments'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-600'
            }`}
          >
            <Calendar className="inline mr-2" size={18} /> ЗАПИСИ
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-black text-sm uppercase rounded transition ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-600'
            }`}
          >
            <Users className="inline mr-2" size={18} /> ПОЛЬЗОВАТЕЛИ
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white border border-slate-200 rounded p-6">
            <h2 className="text-2xl font-black mb-6 text-slate-900 uppercase">ВСЕ ЗАПИСИ</h2>

            {appointments.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Нет записей</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-black text-slate-600 uppercase text-xs">
                        Пациент
                      </th>
                      <th className="text-left py-3 px-4 font-black text-slate-600 uppercase text-xs">
                        Врач
                      </th>
                      <th className="text-left py-3 px-4 font-black text-slate-600 uppercase text-xs">
                        Дата
                      </th>
                      <th className="text-left py-3 px-4 font-black text-slate-600 uppercase text-xs">
                        Статус
                      </th>
                      <th className="text-left py-3 px-4 font-black text-slate-600 uppercase text-xs">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{appointment.patient?.name || 'N/A'}</p>
                          <p className="text-xs text-slate-500">{appointment.patientPhone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{appointment.doctor?.user?.name || 'N/A'}</p>
                          <p className="text-xs text-slate-500">{appointment.doctor?.specialty}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold">{formatDate(appointment.date)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 text-[10px] font-black rounded ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {appointment.status === 'PENDING' && (
                              <button
                                onClick={() => handleApprove(appointment.id)}
                                className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition"
                                title="Подтвердить"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(appointment.id)}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                              title="Удалить"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded p-6">
            <h2 className="text-2xl font-black mb-6 text-slate-900 uppercase">ПОЛЬЗОВАТЕЛИ СИСТЕМЫ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Иван Петров', email: 'ivan@example.com', role: 'PATIENT' },
                { name: 'Мария Сидорова', email: 'maria@example.com', role: 'PATIENT' },
                { name: 'Д-р Волков', email: 'volkov@clinic.com', role: 'DOCTOR' },
                { name: 'Д-р Левицкая', email: 'levitskaya@clinic.com', role: 'DOCTOR' },
                { name: 'Д-р Петровский', email: 'petrovsky@clinic.com', role: 'DOCTOR' },
                { name: 'Д-р Иванова', email: 'ivanova@clinic.com', role: 'DOCTOR' },
              ].map((user, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500 mb-3">{user.email}</p>
                  <span className={`inline-block px-3 py-1 text-[10px] font-black rounded ${
                    user.role === 'ADMIN'
                      ? 'bg-red-100 text-red-700'
                      : user.role === 'DOCTOR'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {user.role === 'ADMIN' ? 'Администратор' : user.role === 'DOCTOR' ? 'Врач' : 'Пациент'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
