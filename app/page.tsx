// ./app/safelink/[id]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import React from 'react';

interface Post {
  title: string;
  date: string;
  thumbnail: string;
  externalLinks: string[];
}

export default function Page({ params }: { params: { id: string } }) {
  const contentDir = path.join(process.cwd(), 'content');
  const filePath = path.join(contentDir, `${params.id}.md`);

  if (!fs.existsSync(filePath)) {
    return <div className="bg-gray-900 text-white p-4 text-center">Postingan tidak ditemukan.</div>;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContent);

  const post: Post = {
    title: data.title || '',
    date: data.date || '',
    thumbnail: data.thumbnail || '',
    externalLinks: data.externalLinks || [data.externalLink || ''],
  };

  return (
    <div className="bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4">{post.title}</h1>
      <p className="mb-2">Tanggal: {post.date}</p>
      <img src={post.thumbnail} alt={post.title} className="w-full h-64 object-cover mb-4" />
      <ul className="list-disc pl-6">
        {post.externalLinks.map((link, i) => (
          <li key={i}>
            <a href={atob(link)} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              {atob(link)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
