import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация изображений
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Компрессия
  compress: true,
  
  // Отключение X-Powered-By заголовка
  poweredByHeader: false,
  
  // React строгий режим для разработки
  reactStrictMode: true,
  
  // Оптимизация импортов
  experimental: {
    optimizePackageImports: ['lucide-react', 'sonner'],
  },
};

export default nextConfig;
