'use client';

import proker from '@/data/proker.json';
import Link from 'next/link';
import styles from './GalleryScroll.module.css';

export default function GalleryScroll() {
  // Collect unique photos from proker (no duplicates)
  const seen = new Set<string>();
  const allPhotos = proker.flatMap((p) =>
    [p.coverImage, ...p.photos]
      .filter((photo) => {
        if (seen.has(photo)) return false;
        seen.add(photo);
        return true;
      })
      .map((photo) => ({
        src: photo,
        title: p.title,
        id: p.id,
      }))
  );

  // Split into two rows
  const mid = Math.ceil(allPhotos.length / 2);
  const row1 = allPhotos.slice(0, mid);
  const row2 = allPhotos.slice(mid);

  return (
    <div className={styles.scrollContainer}>
      {/* Row 1 — scrolls left */}
      <div className={styles.scrollRow}>
        <div className={`${styles.scrollTrack} ${styles.scrollLeft}`}>
          {[...row1, ...row1].map((photo, i) => (
            <Link
              key={`r1-${i}`}
              href={`/proker/${photo.id}`}
              className={styles.scrollItem}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.title} />
              <div className={styles.itemOverlay}>
                <span>{photo.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className={styles.scrollRow}>
        <div className={`${styles.scrollTrack} ${styles.scrollRight}`}>
          {[...row2, ...row2].map((photo, i) => (
            <Link
              key={`r2-${i}`}
              href={`/proker/${photo.id}`}
              className={styles.scrollItem}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.title} />
              <div className={styles.itemOverlay}>
                <span>{photo.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
