'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  date: string;
  status: string;
  doctorId: string;
  doctor: {
    user: {
      name: string;
      email: string;
    };
    specialty: string;
  };
  patientPhone: string;
  patientEmail?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      fetchAppointments();
    }
  }, [status, session]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      toast.error('Ошибка при загрузке записей');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    setCancelling(appointmentId);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Запись отменена');
        await fetchAppointments();
      } else {
        toast.error('Не удалось отменить запись');
      }
    } catch (error) {
      toast.error('Ошибка при отмене записи');
    } finally {
      setCancelling(null);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded w-1/4"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2 uppercase">
              ЛИЧНЫЙ КАБИНЕТ
            </h1>
            <p className="text-slate-500 font-medium">Добро пожаловать, {session.user.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-black text-sm uppercase rounded hover:bg-red-700 transition"
          >
            <LogOut size={18} /> Выход
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white border border-slate-200 p-6 rounded mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-2">ФИО</p>
              <p className="text-lg font-bold text-slate-900">{session.user.name}</p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-2">Email</p>
              <p className="text-lg font-bold text-slate-900">{session.user.email}</p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-2">Роль</p>
              <p className="text-lg font-bold text-blue-600">
                {(session.user as any).role === 'PATIENT' ? 'Пациент' : 'Специалист'}
              </p>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              МОИ ЗАПИСИ
            </h2>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black text-sm uppercase rounded hover:bg-blue-700 transition"
            >
              <Plus size={18} /> Новая запись
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded p-12 text-center">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium mb-4">У вас нет предстоящих записей</p>
              <Link
                href="/booking"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-black text-sm uppercase rounded hover:bg-blue-700 transition"
              >
                Записаться к врачу
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-white border border-slate-200 rounded p-6 hover:border-blue-400 transition">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor Info */}
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase mb-2">Врач</p>
                      <p className="text-xl font-bold text-slate-900 mb-1">
                        {appointment.doctor.user.name}
                      </p>
                      <p className="text-sm text-slate-500 mb-3">
                        {appointment.doctor.specialty}
                      </p>
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded">
                        {appointment.doctor.user.email}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-400 uppercase mb-2">
                            Дата и время
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar size={16} className="text-slate-400" />
                            <p className="font-bold text-slate-900">
                              {formatDate(appointment.date)}
                            </p>
                          </div>

                          <p className="text-xs font-black text-slate-400 uppercase mb-2">Статус</p>
                          <span className={`inline-block px-3 py-1 text-[10px] font-black rounded ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            disabled={cancelling === appointment.id}
                            className="px-4 py-2 bg-red-100 text-red-600 font-black text-[10px] uppercase rounded hover:bg-red-200 transition disabled:opacity-50"
                          >
                            {cancelling === appointment.id ? 'ОТМЕНА...' : 'ОТМЕНИТЬ'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}