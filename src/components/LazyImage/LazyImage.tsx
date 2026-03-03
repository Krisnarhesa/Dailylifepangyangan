'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  sizes?: string;
  priority?: boolean;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  onClick,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onClick={onClick}
    >
      {/* Skeleton placeholder */}
      {!loaded && (
        <div
          className="img-loading"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
          }}
        />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        style={{
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        onLoad={() => setLoaded(true)}
        priority={priority}
      />
    </div>
  );
}
