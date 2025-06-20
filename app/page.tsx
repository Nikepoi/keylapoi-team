import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

type Post = {
  title: string;
  date: string;
  thumbnail: string;
  externalLinks: string[];
};

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);

  const file = files.find((file) => file.replace('.md', '') === id);
  if (!file) return notFound();

  const fileContent = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const { data } = matter(fileContent);

  const post: Post = {
    title: data.title || 'No Title',
    date: data.date || '1970-01-01',
    thumbnail: data.thumbnail || '',
    externalLinks: data.externalLinks || [data.externalLink || ''],
  };

  return (
    <div className="bg-gray-900 text-white p-4 text-center">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm mb-4">{post.date}</p>
      <div className="text-sm">
        {post.externalLinks.map((link, idx) => (
          <div key={idx}>
            <a
              href={atob(link)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Kunjungi Link {idx + 1}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
            }
