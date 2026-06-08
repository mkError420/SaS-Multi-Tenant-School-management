'use client';

import { useState, useEffect } from 'react';
import type { HeroImage } from '../lib/school';

function getDriveDirectLink(url: string) {
  if (url.startsWith('data:image')) return url;
  const match = url.match(/\/(?:d|file\/d)\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}

export default function HeroCarousel({ images }: { images: HeroImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl sm:h-80 lg:h-[480px]">
      {images.map((img, idx) => (
        <img
          key={img.id}
          src={getDriveDirectLink(img.url)}
          alt={img.caption || 'Hero image'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-sky-500' : 'w-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}