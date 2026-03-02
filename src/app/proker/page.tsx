'use client';

import FlowerDecor from '@/components/FlowerDecor/FlowerDecor';
import LazyImage from '@/components/LazyImage/LazyImage';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import proker from '@/data/proker.json';
import Link from 'next/link';
import styles from './proker.module.css';

export default function ProkerPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <FlowerDecor size="large" blur="light" opacity={0.14} rotation={45} delay={0} top="5%" right="-1%" />
        <FlowerDecor size="medium" blur="light" opacity={0.12} rotation={170} delay={2} bottom="5%" left="3%" />
        <FlowerDecor size="small" opacity={0.18} rotation={260} delay={1} top="30%" left="8%" />
        <FlowerDecor size="xs" opacity={0.20} rotation={100} delay={3} top="50%" right="12%" />
        <div className="section-heading">
          <span className="script-title">Program Kerja</span>
          <div className="ornament-divider">
            <span className="ornament-icon">✦</span>
          </div>
          <p className="subtitle">kegiatan selama kkn</p>
        </div>
      </div>

      <div className={`container ${styles.contentArea}`}>
        {/* Scattered flowers across the proker grid */}
        <FlowerDecor size="medium" opacity={0.10} rotation={35} delay={0} top="3%" left="-2%" />
        <FlowerDecor size="large" blur="light" opacity={0.08} rotation={220} delay={2} top="30%" right="-3%" />
        <FlowerDecor size="small" opacity={0.14} rotation={150} delay={4} top="55%" left="5%" />
        <FlowerDecor size="xs" opacity={0.18} rotation={290} delay={1} bottom="10%" right="8%" />
        <FlowerDecor size="medium" blur="light" opacity={0.10} rotation={70} delay={3} bottom="30%" left="-1%" />

        <div className={styles.prokerGrid}>
          {proker.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.1}>
              <Link
                href={`/proker/${item.id}`}
                className={styles.prokerCard}
              >
                <div className={styles.prokerCover}>
                  <LazyImage src={item.coverImage} alt={item.title} className={styles.coverImg} />
                  <span className={styles.prokerBadge}>
                    {item.division}
                  </span>
                </div>
                <div className={styles.prokerInfo}>
                  <h2 className={styles.prokerTitle}>{item.title}</h2>
                  <p className={styles.prokerDesc}>{item.description}</p>
                  <div className={styles.prokerMeta}>
                    <span className={styles.prokerDate}>{item.date}</span>
                    <span className={styles.prokerPhotoCount}>
                      {item.photos.length} foto{('videos' in item && (item as { videos?: string[] }).videos?.length) ? ` · ${(item as { videos?: string[] }).videos!.length} video` : ''}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div style={{ height: '60px' }}></div>
    </>
  );
}
