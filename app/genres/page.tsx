import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);
  const posts = files.map((file) => {
    const fileContent = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data } = matter(fileContent);
    return {
      id: file.replace('.md', ''),
      title: data.title || 'No Title',
      date: data.date || '1970-01-01', // Default ke tanggal awal kalau ga ada
      thumbnail: data.thumbnail || '',
      externalLinks: data.externalLinks || [data.externalLink || ''],
    };
  }).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    // Pake getTime dan fallback ke 0 kalau NaN
    const timeA = !isNaN(dateA.getTime()) ? dateA.getTime() : 0;
    const timeB = !isNaN(dateB.getTime()) ? dateB.getTime() : 0;
    return timeB - timeA; // Sort descending
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-yellow-500 text-center mb-6">KeylaPoi - Postingan Terbaru</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => {
          const decodedLinks = post.externalLinks.map(link => atob(link));
          const serverNames = decodedLinks.map(url => {
            if (url.includes('videy.co')) return 'Videy';
            if (url.includes('1024terabox.com')) return 'Terabox';
            if (url.includes('pixeldrain.com')) return 'Pixeldrain';
            return 'Other';
          });

          return (
            <div key={post.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
              <Link href={`/safelink/${post.id}`} target="_blank" rel="noopener noreferrer">
                <Image src={post.thumbnail} alt={post.title} width={300} height={300} className="w-full h-48 object-cover" />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-yellow-500">{post.title}</h3>
                  <p className="text-gray-400 text-sm">{post.date}</p>
                  {serverNames.length > 0 && (
                    <p className="text-gray-300 text-xs">Links: {serverNames.join(', ')}</p>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
          }
