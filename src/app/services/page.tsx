import { ShieldAlert, Zap, HeartPulse, BrainCircuit } from "lucide-react";

const SERVICES = [
  { title: "НЕЙРО-ДИАГНОСТИКА", desc: "Анализ МРТ с помощью ИИ для выявления патологий на ранних стадиях.", icon: <BrainCircuit className="text-blue-600" /> },
  { title: "ГЕНЕТИЧЕСКИЙ_КОД", desc: "Полное секвенирование генома для персонализированного лечения.", icon: <Fingerprint className="text-blue-600" /> },
  { title: "КАРДИО_МОНИТОРИНГ", desc: "Дистанционное отслеживание ритма в режиме 24/7.", icon: <HeartPulse className="text-blue-600" /> },
];

export default function ServicesPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-6xl font-black tracking-tighter mb-16 uppercase">ТЕХНОЛОГИЧЕСКИЕ_УСЛУГИ</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
        {SERVICES.map((s, i) => (
          <div key={i} className="bg-white p-12 hover:bg-slate-50 transition-all group">
            <div className="mb-8">{s.icon}</div>
            <h3 className="text-xl font-bold mb-4">{s.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">{s.desc}</p>
            <div className="h-1 w-12 bg-blue-600 group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </main>
  );
}