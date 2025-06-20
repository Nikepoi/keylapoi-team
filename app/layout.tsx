import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-900 text-white font-poppins">
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4 justify-center">
            <li><Link href="/" className="text-yellow-500 hover:text-yellow-400">Home</Link></li>
            <li><Link href="/genres" className="text-yellow-500 hover:text-yellow-400">Genres</Link></li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
