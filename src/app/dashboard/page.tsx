import { Clock, User, CalendarDays, Activity } from "lucide-react";

async function getAppointments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/appointments`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function DashboardPage() {
  const appointments = await getAppointments();

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">ЛИЧНЫЙ_КАБИНЕТ_ПАЦИЕНТА</h1>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.2em] mt-2">SYSTEM_STATUS: ACTIVE // USER_ID: 00124</p>
        </div>
        <div className="bg-blue-600 text-white p-4 font-black text-xs tracking-widest">
          LIVE_MONITORING
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка: Список записей */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-2">
            <CalendarDays size={16} /> ПРЕДСТОЯЩИЕ_ВИЗИТЫ
          </h2>
          
          {appointments.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-slate-200 text-center text-slate-400 font-bold text-xs uppercase">
              Записей не обнаружено
            </div>
          ) : (
            appointments.map((app: any) => (
              <div key={app.id} className="bg-white border border-slate-200 p-6 flex items-center justify-between group hover:border-blue-600 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-100 flex items-center justify-center font-black text-blue-600 border border-slate-200">
                    {app.doctor?.specialty[0]}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{app.doctor?.name}</div>
                    <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{app.doctor?.specialty}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm tracking-tighter">{new Date(app.date).toLocaleDateString()}</div>
                  <div className="text-blue-600 font-bold text-xs">{new Date(app.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div className={`px-3 py-1 text-[8px] font-black tracking-widest border ${
                  app.status === 'PENDING' ? 'border-yellow-400 text-yellow-600' : 'border-green-400 text-green-600'
                }`}>
                  {app.status}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Правая колонка: Виджеты */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 text-white">
            <Activity className="text-blue-500 mb-6" size={32} />
            <h3 className="font-black tracking-tighter text-xl mb-2">ПОКАЗАТЕЛИ_ЗДОРОВЬЯ</h3>
            <p className="text-slate-400 text-xs mb-6">Синхронизация с вашими устройствами...</p>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold text-slate-500">PULSE</span>
                <span className="font-mono text-blue-400">72 BPM</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold text-slate-500">OXYGEN</span>
                <span className="font-mono text-blue-400">98%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}