import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);
  return files.map(file => ({ id: file.replace('.md', '') }));
}
