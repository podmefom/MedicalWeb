'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar, Clock, User, Phone, CheckCircle2 } from 'lucide-react';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Состояния для формы
  const [formData, setFormData] = useState({
    doctorId: '1',
    patientName: '',
    patientPhone: '',
    date: '',
    slot: ''
  });

  const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('ЗАПИСЬ_СОЗДАНА', { description: 'Ждем вас в клинике!' });
        setStep(3);
      } else {
        toast.error('ОШИБКА', { description: data.error || 'Что-то пошло не так' });
      }
    } catch (err) {
      toast.error('ОШИБКА_СЕТИ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">ОФОРМЛЕНИЕ_ЗАПИСИ</h1>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 w-12 ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
              <button 
                disabled={!formData.date || !formData.slot}
                onClick={() => setStep(2)}
                className="mt-8 py-5 bg-slate-900 text-white font-black text-[11px] tracking-widest uppercase disabled:opacity-50"
              >
                ПРОДОЛЖИТЬ
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
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
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 border border-slate-200 font-black text-[11px] tracking-widest uppercase">НАЗАД</button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] py-5 bg-blue-600 text-white font-black text-[11px] tracking-widest uppercase"
                >
                  {loading ? 'ОБРАБОТКА...' : 'ПОДТВЕРДИТЬ_ЗАПИСЬ'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 border-2 border-dashed border-blue-100">
            <CheckCircle2 size={64} className="text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-black tracking-tighter mb-2">УСПЕШНО!</h2>
            <p className="text-slate-500 mb-8">Ваш визит забронирован в системе.</p>
            <button onClick={() => window.location.href = '/dashboard'} className="px-8 py-4 bg-slate-900 text-white font-black text-[10px] tracking-widest uppercase">
              В ЛИЧНЫЙ КАБИНЕТ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}