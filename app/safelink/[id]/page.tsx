"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Image from 'next/image';

export default function Safelink({ post }) {
  const params = useParams();
  const { id } = params || {};
  const [countdown, setCountdown] = useState(6);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [decodedLinks, setDecodedLinks] = useState<string[]>([]);

  useEffect(() => {
    if (post?.externalLinks?.length) {
      const decoded = post.externalLinks.map(link => atob(link));
      setDecodedLinks(decoded);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [post]);

  const handleRedirect = () => {
    if (!isRedirecting && decodedLinks[currentLinkIndex]) {
      setIsRedirecting(true);
      alert('Link akan dibuka di tab baru!');
      window.open(decodedLinks[currentLinkIndex], '_blank');
      setCurrentLinkIndex((prev) => (prev + 1) % decodedLinks.length);
      setCountdown(6);
      setIsRedirecting(false);
    }
  };

  const getServerName = (url: string) => {
    if (url.includes('videy.co')) return 'Videy';
    if (url.includes('1024terabox.com')) return 'Terabox';
    if (url.includes('pixeldrain.com')) return 'Pixeldrain';
    return 'Other';
  };

  if (!post) return <div className="bg-gray-900 text-white p-4 text-center">Postingan ga ketemu!</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-poppins">
      <div className="download-container bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border border-gray-700">
        <noscript><p className="text-red-500 mb-4 text-center">Aktifkan JavaScript!</p></noscript>
        <div className="separator mb-4"><Image src={post.thumbnail} alt={post.title} width={300} height={300} className="w-full h-auto rounded-lg" /></div>
        <h3 className="text-xl font-bold text-yellow-500 mb-2 text-center">{post.title}</h3>
        <h4 className="text-lg text-gray-300 mb-2 text-center">Download via</h4>
        <ul className="mb-4">
          {post.externalLinks.map((link, index) => {
            const serverName = getServerName(decodedLinks[index] || '');
            return (
              <li key={index} className="text-center mb-2">
                <a
                  href="#"
                  onClick={handleRedirect}
                  className="download-button bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed inline-block"
                  disabled={countdown > 0 || isRedirecting || index !== currentLinkIndex}
                >
                  {`${serverName} ${index + 1} - ${countdown > 0 && index === 0 ? `Tunggu ${countdown} detik...` : 'OK'}`}
                </a>
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
