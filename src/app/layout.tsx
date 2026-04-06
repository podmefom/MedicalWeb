import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "MEDICAL_CORE // ЦИФРОВАЯ МЕДИЦИНА",
  description: "Система управления здоровьем нового поколения",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.variable} ${space.variable} antialiased bg-white text-slate-900`}>
        <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="font-space font-bold text-xl tracking-tighter">
              MED<span className="text-blue-600">_CORE</span>
            </div>
            <div className="hidden md:flex space-x-8 text-[10px] font-black tracking-widest uppercase">
              <a href="/doctors" className="hover:text-blue-600 transition-colors">Врачи</a>
              <a href="/services" className="hover:text-blue-600 transition-colors">Услуги</a>
              <a href="/booking" className="px-4 py-2 bg-blue-600 text-white hover:bg-black transition-all">Запись_на_прием</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}