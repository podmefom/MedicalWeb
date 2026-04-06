'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar, Clock, User, Phone, CheckCircle2 } from 'lucide-react';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  bio: string;
  image?: string;
};

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Состояния для формы
  const [formData, setFormData] = useState({
    doctorId: '',
    patientName: '',
    patientPhone: '',
    date: '',
    slot: ''
  });

  const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  // Загрузка списка врачей при монтировании
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        const data = await response.json();
        setDoctors(data);
        console.log('Врачи загружены:', data);
      } catch (err) {
        console.error('Ошибка при загрузке врачей:', err);
        toast.error('Ошибка', { description: 'Не удалось загрузить список врачей' });
      }
    };
    loadDoctors();
  }, []);

  const selectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ ...formData, doctorId: doctor.id });
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Отправляю данные:', formData);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Ответ от API:', data, 'Статус:', response.status);

      if (response.ok) {
        toast.success('ЗАПИСЬ_СОЗДАНА', { description: 'Ждем вас в клинике!' });
        setStep(4);
      } else {
        const errorMsg = data.details 
          ? data.details.map((d: any) => `${d.field}: ${d.message}`).join(', ')
          : data.error || 'Что-то пошло не так';
        toast.error('ОШИБКА', { description: errorMsg });
        console.error('API Error:', data);
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
      toast.error('ОШИБКА_СЕТИ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">ОФОРМЛЕНИЕ_ЗАПИСИ</h1>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1 flex-1 ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 0: Выбор врача */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid gap-6">
              <section>
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-6 block">Выберите врача</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctors.length === 0 ? (
                    <p className="text-slate-500">Загрузка врачей...</p>
                  ) : (
                    doctors.map(doctor => (
                      <button
                        key={doctor.id}
                        onClick={() => selectDoctor(doctor)}
                        className="p-6 border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left rounded"
                      >
                        {doctor.image && (
                          <div className="w-full h-40 bg-slate-200 rounded mb-4 overflow-hidden flex items-center justify-center text-slate-400">
                            <span>📷 {doctor.name}</span>
                          </div>
                        )}
                        <h3 className="font-black text-lg mb-1">{doctor.name}</h3>
                        <p className="text-blue-600 font-bold text-sm mb-2">{doctor.specialty}</p>
                        <p className="text-slate-600 text-xs mb-3 line-clamp-2">{doctor.bio}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="bg-slate-100 px-3 py-1 rounded font-bold">
                            {doctor.experience} лет опыта
                          </span>
                          <span className="text-blue-600 font-black">→ ВЫБРАТЬ</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        )}

        {/* STEP 1: Выбор даты и времени */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600">
              <p className="text-sm font-bold">Выбранный врач: <span className="text-blue-600">{selectedDoctor?.name}</span></p>
            </div>
            <div className="grid gap-6">
              <section>
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-4 block">Выберите дату</label>
                <input 
                  type="date" 
                  className="w-full p-4 border border-slate-200 focus:border-blue-600 outline-none font-bold"
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </section>
              <section>
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-4 block">Доступное время</label>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(s => (
                    <button 
                      key={s}
                      onClick={() => setFormData({...formData, slot: s})}
                      className={`p-3 text-xs font-bold border ${formData.slot === s ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:border-slate-900'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setStep(0)}
                  className="flex-1 py-5 border border-slate-200 font-black text-[11px] tracking-widest uppercase"
                >
                  НАЗАД
                </button>
                <button 
                  disabled={!formData.date || !formData.slot}
                  onClick={() => setStep(2)}
                  className="flex-[2] py-5 bg-slate-900 text-white font-black text-[11px] tracking-widest uppercase disabled:opacity-50"
                >
                  ПРОДОЛЖИТЬ
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Личные данные */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600">
              <p className="text-sm font-bold">
                {selectedDoctor?.name} • {formData.date} в {formData.slot}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <input 
                placeholder="ВАШЕ ФИО"
                className="w-full p-4 border border-slate-200 focus:border-blue-600 outline-none font-bold"
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                required
              />
              <input 
                placeholder="НОМЕР ТЕЛЕФОНА"
                className="w-full p-4 border border-slate-200 focus:border-blue-600 outline-none font-bold"
                onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                required
              />
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 border border-slate-200 font-black text-[11px] tracking-widest uppercase"
                >
                  НАЗАД
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] py-5 bg-blue-600 text-white font-black text-[11px] tracking-widest uppercase disabled:opacity-50"
                >
                  {loading ? 'ОБРАБОТКА...' : 'ПОДТВЕРДИТЬ_ЗАПИСЬ'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3/4: Успех */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 border-2 border-dashed border-blue-100">
            <CheckCircle2 size={64} className="text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-black tracking-tighter mb-2">УСПЕШНО!</h2>
            <p className="text-slate-500 mb-8">Ваш визит забронирован в системе.</p>
            <p className="text-sm text-slate-600 mb-8">
              Врач: <span className="font-bold">{selectedDoctor?.name}</span><br/>
              Дата: <span className="font-bold">{formData.date} в {formData.slot}</span>
            </p>
            <button onClick={() => window.location.href = '/dashboard'} className="px-8 py-4 bg-slate-900 text-white font-black text-[10px] tracking-widest uppercase">
              В ЛИЧНЫЙ КАБИНЕТ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}