import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "MEDICAL_CORE // ЦИФРОВАЯ МЕДИЦИНА",
  description: "Система управления здоровьем нового поколения",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="scroll-smooth" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${space.variable} antialiased bg-white text-slate-900`}>
        <nav className="fixed top-0 w-full z-[100] border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="font-space font-bold text-xl tracking-tighter">
              MED<span className="text-blue-600">_CORE</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-10 text-[10px] font-black tracking-[0.2em] uppercase">
              <Link href="/doctors" className="hover:text-blue-600 transition-colors">Врачи</Link>
              <Link href="/services" className="hover:text-blue-600 transition-colors">Услуги</Link>
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Кабинет</Link>
              <Link href="/booking" className="px-5 py-3 bg-blue-600 text-white hover:bg-black transition-all">
                Запись_на_прием
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}