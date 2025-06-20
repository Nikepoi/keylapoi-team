import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KeylaPoi',
  description: 'Tautan 18+ legal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-900 text-white font-poppins">
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4 justify-center">
            <li><Link href="/" className="text-yellow-500 hover:text-yellow-400">Home</Link></li>
            <li><Link href="/genres" className="text-yellow-500 hover:text-yellow-400">Genres</Link></li>
          </ul>
        </nav>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
