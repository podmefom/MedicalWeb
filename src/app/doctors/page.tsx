import { Search, Filter } from "lucide-react";

const DOCTORS = [
  { id: "1", name: "Д-р А. Воскресенский", spec: "КАРДИОЛОГИЯ", exp: 12, rating: 4.9 },
  { id: "2", name: "Д-р Е. Нейронова", spec: "НЕВРОЛОГИЯ", exp: 8, rating: 5.0 },
  { id: "3", name: "Д-р И. Белозубов", spec: "СТОМАТОЛОГИЯ", exp: 15, rating: 4.8 },
  { id: "4", name: "Д-р М. Окунева", spec: "ОФТАЛЬМОЛОГИЯ", exp: 10, rating: 4.7 },
];

export default function DoctorsPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <header className="mb-16">
        <h1 className="text-6xl font-black tracking-tighter mb-4 text-slate-900 uppercase">
          НАШИ_СПЕЦИАЛИСТЫ
        </h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-slate-500 max-w-md font-medium">
            Проверенная база врачей высшей категории. Интегрированная система записи в один клик.
          </p>
          <div className="flex bg-slate-100 p-2 rounded-none border border-slate-200">
            <div className="px-4 py-2 bg-white flex items-center space-x-2 border border-slate-200 shadow-sm">
              <Search size={16} className="text-blue-600" />
              <input 
                type="text" 
                placeholder="ПОИСК_ВРАЧА..." 
                className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest uppercase w-48"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {DOCTORS.map((doc) => (
          <div key={doc.id} className="group relative bg-white border border-slate-200 p-6 hover:border-blue-600 transition-all duration-500">
            <div className="aspect-[4/5] bg-slate-100 mb-6 relative overflow-hidden">
               {/* Заглушка для фото */}
               <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black text-xs uppercase opacity-20">
                 DOC_ID_{doc.id}_PHOTO
               </div>
               <div className="absolute top-4 left-4 bg-blue-600 text-white text-[8px] font-black px-2 py-1 tracking-tighter">
                 {doc.spec}
               </div>
            </div>
            
            <h3 className="text-xl font-bold tracking-tight mb-1 text-slate-900">{doc.name}</h3>
            <p className="text-[10px] font-black text-slate-400 tracking-widest mb-6">СТАЖ: {doc.exp} ЛЕТ // RATING: {doc.rating}</p>
            
            <a 
              href={`/booking?doc=${doc.id}`} 
              className="block w-full py-3 bg-slate-900 text-white text-center text-[10px] font-black tracking-widest hover:bg-blue-600 transition-all uppercase"
            >
              ЗАПИСАТЬСЯ_НА_ПРИЕМ
            </a>
          </div>
        ))}
      </section>
    </main>
  );
}