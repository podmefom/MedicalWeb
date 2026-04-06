'use client';

import { motion } from "framer-motion";
import { ArrowRight, Shield, Activity, Microscope, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] as const 
      } 
    }
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <section className="relative pt-48 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 mb-8 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>Core System v2.0.4 // Active</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-10 uppercase">
            Цифровая <br />
            <span className="text-blue-600">Экосистема</span> <br />
            Здоровья
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mb-12 leading-relaxed">
            Интегрированная платформа превентивной медицины. Нейросетевая диагностика, мгновенная запись и полная безопасность данных.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking" className="group flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white text-[11px] font-black tracking-widest uppercase hover:bg-blue-600 transition-all duration-300">
              Записаться на прием
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/doctors" className="flex items-center justify-center px-10 py-5 bg-transparent border border-slate-200 text-slate-900 text-[11px] font-black tracking-widest uppercase hover:border-slate-900 transition-all duration-300">
              База специалистов
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-100">
          {[
            { icon: <Shield size={24} />, title: "SECURITY_CORE", desc: "Шифрование данных по стандарту AES-256." },
            { icon: <Microscope size={24} />, title: "AI_DIAGNOSTICS", desc: "Анализ показателей здоровья в реальном времени." },
            { icon: <Zap size={24} />, title: "FAST_RESPONSE", desc: "Связь с врачом в течение 10 минут." }
          ].map((item, i) => (
            <div key={i} className="p-12 hover:bg-white transition-colors group">
              <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2 tracking-tight uppercase">{item.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}