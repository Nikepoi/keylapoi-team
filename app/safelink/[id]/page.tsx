import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Image from 'next/image';

// Definisikan tipe buat post
interface Post {
  title: string;
  date: string;
  thumbnail: string;
  externalLinks: string[];
  [key: string]: any; // Buat field tambahan seperti genre
}

export default function Safelink({ params }: { params: { id: string } }) {
  const contentDir = path.join(process.cwd(), 'content');
  const file = fs.readdirSync(contentDir).find(f => f.replace('.md', '') === params.id);
  let post: Post | null = null;

  if (file) {
    const fileContent = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data } = matter(fileContent);
    post = { ...data, externalLinks: data.externalLinks || [data.externalLink || ''] };
  }

  if (!post) return <div className="bg-gray-900 text-white p-4 text-center">Postingan ga ketemu!</div>;

  const handleRedirect = (link: string) => {
    alert('Link akan dibuka di tab baru!');
    window.open(atob(link), '_blank');
  };

  const getServerName = (url: string) => {
    if (url.includes('videy.co')) return 'Videy';
    if (url.includes('1024terabox.com')) return 'Terabox';
    if (url.includes('pixeldrain.com')) return 'Pixeldrain';
    return 'Other';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-poppins">
      <div className="download-container bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border border-gray-700">
        <noscript><p className="text-red-500 mb-4 text-center">Aktifkan JavaScript!</p></noscript>
        <div className="separator mb-4"><Image src={post.thumbnail} alt={post.title} width={300} height={300} className="w-full h-auto rounded-lg" /></div>
        <h3 className="text-xl font-bold text-yellow-500 mb-2 text-center">{post.title}</h3>
        <h4 className="text-lg text-gray-300 mb-2 text-center">Download via</h4>
        <ul className="mb-4">
          {post.externalLinks.map((link, index) => {
            const serverName = getServerName(atob(link));
            return (
              <li key={index} className="text-center mb-2">
                <button
                  onClick={() => handleRedirect(link)}
                  className="download-button bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 w-full"
                >
                  {`${serverName} ${index + 1}`}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="text-gray-400 mt-4 text-center">Izinkan pop-up di browser.</p>
        <div className="mt-6 text-sm text-gray-300 text-center">
          <p>© 2025 KeylaPoi. Hanya redirect, ga nyimpan data. Hubungi <a href="mailto:kontak@keylapoi.site" className="text-yellow-500">kontak@keylapoi.site</a> kalau ada masalah.</p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);
  return files.map(file => ({ id: file.replace('.md', '') }));
      }
