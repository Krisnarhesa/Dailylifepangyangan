'use client';

import LazyImage from '@/components/LazyImage/LazyImage';
import proker from '@/data/proker.json';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './GalleryScroll.module.css';

// Seeded shuffle — konsisten di server & client (no hydration mismatch)
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GalleryScroll() {
  // Collect photos balanced across proker (round-robin)
  const allPhotos = useMemo(() => {
    const seen = new Set<string>();

    // Build per-proker unique photo lists
    const perProker = proker.map((p) => {
      const unique = [p.coverImage, ...p.photos].filter((photo) => {
        if (seen.has(photo)) return false;
        seen.add(photo);
        return true;
      });
      return unique.map((src) => ({ src, title: p.title, id: p.id }));
    });

    // Round-robin: ambil 1 foto dari tiap proker secara bergantian
    const balanced: typeof perProker[0] = [];
    const maxLen = Math.max(...perProker.map((p) => p.length));
    for (let i = 0; i < maxLen; i++) {
      for (const photos of perProker) {
        if (i < photos.length) {
          balanced.push(photos[i]);
        }
      }
    }

    // Shuffle
    const shuffled = seededShuffle(balanced, 7919);

    // Prevent same proker appearing side by side
    for (let i = 1; i < shuffled.length - 1; i++) {
      if (shuffled[i].id === shuffled[i - 1].id) {
        // Swap with a later item that has a different id
        for (let j = i + 1; j < shuffled.length; j++) {
          if (shuffled[j].id !== shuffled[i - 1].id && shuffled[j].id !== shuffled[i + 1]?.id) {
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            break;
          }
        }
      }
    }

    return shuffled;
  }, []);

  // Split into 3 horizontal rows
  const rowSize = Math.ceil(allPhotos.length / 3);
  const row1 = allPhotos.slice(0, rowSize);
  const row2 = allPhotos.slice(rowSize, rowSize * 2);
  const row3 = allPhotos.slice(rowSize * 2);

  const renderRow = (photos: typeof row1, key: string, direction: 'left' | 'right', speed: 'slow' | 'medium' | 'fast') => (
    <div className={styles.scrollRow}>
      <div
        className={[
          styles.scrollTrack,
          direction === 'left' ? styles.scrollLeft : styles.scrollRight,
          speed === 'slow' ? styles.scrollSlow : speed === 'fast' ? styles.scrollFast : styles.scrollMedium,
        ].join(' ')}
      >
        {[...photos, ...photos].map((photo, i) => (
          <Link key={`${key}-${i}`} href={`/kegiatan/${photo.id}`} className={styles.scrollItem}>
            <div className={styles.polaroidCard}>
              <div className={styles.polaroidImageWrapper}>
                <LazyImage src={photo.src} alt={photo.title} className={styles.scrollImg} />
              </div>
              <div className={styles.polaroidCaption}>
                <span>{photo.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.scrollContainer}>
      {renderRow(row1, 'r1', 'left', 'slow')}
      {renderRow(row2, 'r2', 'right', 'medium')}
      {renderRow(row3, 'r3', 'left', 'fast')}
    </div>
  );
}
