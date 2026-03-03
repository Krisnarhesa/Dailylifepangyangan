'use client';
import LazyImage from '@/components/LazyImage/LazyImage';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import proker from '@/data/proker.json';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import styles from '../proker.module.css';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov'];

function isVideo(src: string) {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

interface ProkerItem {
  id: string;
  title: string;
  division: string;
  description: string;
  date: string;
  coverImage: string;
  photos: string[];
  videos?: string[];
}

export default function ProkerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const item = (proker as ProkerItem[]).find((p) => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Combine photos and videos into single media array
  const allMedia = item ? [...item.photos, ...(item.videos || [])] : [];

  if (!item) {
    return (
      <div className={styles.emptyState}>
        <p>Kegiatan tidak ditemukan.</p>
        <Link href="/proker" className="btn-outline" style={{ marginTop: '24px', display: 'inline-block' }}>
          ← Kembali ke Kegiatan
        </Link>
      </div>
    );
  }

  return (
    <>
      <ScrollReveal>
        <div className={styles.detailHeader}>
          <Link href="/proker" className={styles.backLink}>
            ← Kembali ke Kegiatan
          </Link>
          <h1 className={styles.detailTitle}>{item.title}</h1>
          <p className={styles.detailDesc}>{item.description}</p>
          <p className={styles.detailDate}>{item.date}{item.division && ` • ${item.division}`}</p>
          <div className="ornament-divider" style={{ marginTop: '24px' }}>
            <span className="ornament-icon">✦</span>
          </div>
        </div>
      </ScrollReveal>

      <div className="container">
        {allMedia.length > 0 ? (
          <div className={styles.galleryGrid}>
            {allMedia.map((src, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div
                  className={styles.galleryItem}
                  onClick={() => setLightboxIndex(index)}
                >
                  {isVideo(src) ? (
                    <video
                      src={src}
                      className={styles.galleryMedia}
                      muted
                      playsInline
                      preload="metadata"
                      onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => {
                        const v = e.target as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                      }}
                    />
                  ) : (
                    <LazyImage src={src} alt={`${item.title} - ${index + 1}`} className={styles.galleryMedia} />
                  )}
                  {isVideo(src) && (
                    <div className={styles.videoIndicator}>▶</div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Belum ada foto untuk kegiatan ini.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={() => setLightboxIndex(null)}>
          <button className={styles.lightboxClose}>✕</button>

          {lightboxIndex > 0 && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
            >
              ‹
            </button>
          )}

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            {isVideo(allMedia[lightboxIndex]) ? (
              <video
                src={allMedia[lightboxIndex]}
                className={styles.lightboxMedia}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <Image
                src={allMedia[lightboxIndex]}
                alt={`${item.title} - ${lightboxIndex + 1}`}
                className={styles.lightboxMedia}
                fill
                sizes="(max-width: 768px) 95vw, 80vw"
                style={{ objectFit: 'contain' }}
              />
            )}
            <p className={styles.lightboxCaption}>
              {lightboxIndex + 1} / {allMedia.length}
            </p>
          </div>

          {lightboxIndex < allMedia.length - 1 && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
            >
              ›
            </button>
          )}
        </div>
      )}

      <div style={{ height: '60px' }}></div>
    </>
  );
}
