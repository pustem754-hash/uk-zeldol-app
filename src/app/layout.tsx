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
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
