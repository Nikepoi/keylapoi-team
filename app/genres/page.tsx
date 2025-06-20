import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function Genres({ postsByGenre }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-yellow-500 text-center mb-6">KeylaPoi - Genres</h1>
      {Object.keys(postsByGenre).map((genre) => (
        <div key={genre} className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-4">{genre}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postsByGenre[genre].map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 p-4">
                <Link href={`/safelink/${post.id}`} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-lg font-semibold text-yellow-500">{post.title}</h3>
                  <p className="text-gray-400 text-sm">{post.date}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);
  const posts = files.map((file) => {
    const fileContent = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data } = matter(fileContent);
    return { id: file.replace('.md', ''), ...data, externalLinks: data.externalLinks || [data.externalLink || ''] };
  });

  const postsByGenre = posts.reduce((acc, post) => {
    const genre = post.genre || 'Uncategorized';
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(post);
    return acc;
  }, {});

  return { props: { postsByGenre } };
}
