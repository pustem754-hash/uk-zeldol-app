import '@/app/globals.css';
import { Sidebar } from '@/components/Sidebar';

export const metadata = {
  title: 'Marquis — AI Agent',
  description: 'Маркиз — AI-агент-ассистент для генерации контента и SEO',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-marquis-secondary text-white min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar — фиксированная ширина, не налезает на контент */}
          <Sidebar />
          {/* Main content — занимает оставшееся пространство */}
          <main className="flex-1 w-full max-w-none px-4 md:px-8 py-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
