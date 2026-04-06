import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Award, Clock, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function DoctorProfile({ params }: { params: { id: string } }) {
  // Получаем данные конкретного врача из БД
  const doctor = await prisma.doctor.findUnique({
    where: { id: params.id },
  });

  if (!doctor) notFound();

  return (
    <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <Link href="/doctors" className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 hover:text-blue-600 mb-12 transition-colors uppercase">
        <ArrowLeft size={14} /> Назад_к_списку
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Фото и статы */}
        <div className="space-y-8">
          <div className="aspect-[3/4] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 font-black text-xs uppercase">
            PHOTO_ID_{doctor.id}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase">Опыт</span>
              <span className="font-bold">{doctor.experience} лет</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase">Рейтинг</span>
              <div className="flex items-center gap-1 font-bold">
                <Star size={14} className="fill-yellow-400 text-yellow-400" /> 5.0
              </div>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="md:col-span-2">
          <div className="inline-block px-3 py-1 bg-blue-600 text-white text-[8px] font-black tracking-tighter mb-4 uppercase">
            {doctor.specialty}
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase">
            {doctor.name}
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-10 font-medium">
            {doctor.bio}. Специалист мирового уровня, использующий протоколы доказательной медицины и передовые технологические решения нашего центра.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="p-6 bg-slate-50 border border-slate-100">
              <Award className="text-blue-600 mb-4" size={24} />
              <h4 className="font-bold text-sm mb-1 uppercase">Сертификация</h4>
              <p className="text-xs text-slate-400 font-medium tracking-tight">ISO 9001:2026 / Health Core</p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-100">
              <Clock className="text-blue-600 mb-4" size={24} />
              <h4 className="font-bold text-sm mb-1 uppercase">График</h4>
              <p className="text-xs text-slate-400 font-medium tracking-tight">ПН-ПТ: 09:00 - 18:00</p>
            </div>
          </div>

          <Link href={`/booking?doc=${doctor.id}`} className="block w-full py-5 bg-slate-900 text-white text-center text-[11px] font-black tracking-[0.2em] uppercase hover:bg-blue-600 transition-all">
            ЗАПИСАТЬСЯ_К_СПЕЦИАЛИСТУ
          </Link>
        </div>
      </div>
    </main>
  );
}