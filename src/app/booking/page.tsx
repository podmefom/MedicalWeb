'use client';

import { useState } from 'react';
import { Calendar, Clock, User, ChevronRight, CheckCircle2 } from 'lucide-react';

// Заглушка данных, которые потом будем тянуть из базы (Prisma)
const DOCTORS = [
  { id: '1', name: 'Д-р А. Воскресенский', spec: 'КАРДИОЛОГИЯ' },
  { id: '2', name: 'Д-р Е. Нейронова', spec: 'НЕВРОЛОГИЯ' },
];

const SLOTS = ['09:00', '10:30', '12:00', '14:30', '16:00', '18:00'];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Логика перехода по шагам
  const handleNext = () => setStep((p) => Math.min(p + 1, 3));
  // Внутри компонента BookingPage добавь:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Собираем данные из инпутов (нужно добавить стейты для ФИО и телефона)
    const bookingData = {
      doctorId: selectedDoc,
      date: selectedDate,
      slot: selectedSlot,
      patientName: (e.target as any)[0].value, // Упрощенно для примера
      phone: (e.target as any)[1].value,
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setStep(4); // Успех
      } else {
        alert('ОШИБКА_ПРИ_ЗАПИСИ. ПРОВЕРЬТЕ_ДАННЫЕ.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
          ОФОРМЛЕНИЕ_ЗАПИСИ
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Защищенный портал бронирования. Шаг {step} из 3.
        </p>
      </header>

      {/* Прогресс-бар */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-2 flex-1 rounded-none transition-colors ${
              step >= i ? 'bg-blue-600' : 'bg-slate-200'
            }`} 
          />
        ))}
      </div>

      <div className="bg-white border border-slate-200 p-8 shadow-sm">
        {/* ШАГ 1: ВЫБОР ВРАЧА */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
              <User size={20} className="text-blue-600" /> Выберите специалиста
            </h2>
            <div className="space-y-3">
              {DOCTORS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`w-full text-left p-4 border transition-all ${
                    selectedDoc === doc.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">{doc.name}</div>
                  <div className="text-[10px] font-black tracking-widest text-slate-500 mt-1">{doc.spec}</div>
                </button>
              ))}
            </div>
            <button 
              disabled={!selectedDoc}
              onClick={handleNext}
              className="mt-8 w-full py-4 bg-slate-900 text-white font-bold tracking-widest text-[10px] uppercase disabled:opacity-50 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              ПРОДОЛЖИТЬ <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ШАГ 2: ДАТА И ВРЕМЯ */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
              <Calendar size={20} className="text-blue-600" /> Выберите дату и время
            </h2>
            <input 
              type="date" 
              className="w-full p-4 border border-slate-200 mb-6 font-medium text-slate-900 outline-none focus:border-blue-600"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              {SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 text-sm font-bold border transition-all ${
                    selectedSlot === slot ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="px-6 py-4 border border-slate-200 font-bold text-[10px] tracking-widest uppercase hover:bg-slate-50">
                НАЗАД
              </button>
              <button 
                disabled={!selectedDate || !selectedSlot}
                onClick={handleNext}
                className="flex-1 py-4 bg-slate-900 text-white font-bold tracking-widest text-[10px] uppercase disabled:opacity-50 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                ПРОДОЛЖИТЬ <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ШАГ 3: ПОДТВЕРЖДЕНИЕ И ДАННЫЕ */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
              <Clock size={20} className="text-blue-600" /> Финализация записи
            </h2>
            <div className="bg-slate-50 p-4 border border-slate-200 mb-6 text-sm">
              <div className="mb-2"><span className="text-slate-500 font-medium">Врач:</span> {DOCTORS.find(d => d.id === selectedDoc)?.name}</div>
              <div className="mb-2"><span className="text-slate-500 font-medium">Дата:</span> {selectedDate}</div>
              <div><span className="text-slate-500 font-medium">Время:</span> {selectedSlot}</div>
            </div>

            <div className="space-y-4 mb-8">
              <input type="text" placeholder="ФИО ПАЦИЕНТА" required className="w-full p-4 border border-slate-200 font-medium text-slate-900 outline-none focus:border-blue-600" />
              <input type="tel" placeholder="ТЕЛЕФОН" required className="w-full p-4 border border-slate-200 font-medium text-slate-900 outline-none focus:border-blue-600" />
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(2)} className="px-6 py-4 border border-slate-200 font-bold text-[10px] tracking-widest uppercase hover:bg-slate-50">
                НАЗАД
              </button>
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold tracking-widest text-[10px] uppercase hover:bg-black transition-all">
                ПОДТВЕРДИТЬ_ЗАПИСЬ
              </button>
            </div>
          </form>
        )}

        {/* ШАГ 4: УСПЕХ */}
        {step === 4 && (
          <div className="text-center py-12 animate-in zoom-in-95 duration-500">
            <CheckCircle2 size={64} className="text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">ЗАПИСЬ УСПЕШНО ОФОРМЛЕНА</h2>
            <p className="text-slate-500 font-medium mb-8">Система отправит детали на ваш номер телефона.</p>
            <a href="/" className="px-8 py-4 bg-slate-900 text-white font-bold tracking-widest text-[10px] uppercase hover:bg-blue-600 transition-all">
              ВЕРНУТЬСЯ_НА_ГЛАВНУЮ
            </a>
          </div>
        )}
      </div>
    </main>
  );
}