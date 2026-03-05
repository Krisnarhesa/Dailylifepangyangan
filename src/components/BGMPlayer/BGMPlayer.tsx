'use client';

import { useAppContext } from '@/components/AppContext/AppContext';
import siteConfig from '@/data/siteConfig.json';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './BGMPlayer.module.css';

export default function BGMPlayer() {
  const { entered, setEntered } = useAppContext();
  const [playing, setPlaying] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(siteConfig.bgmFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleEnter = () => {
    setFadeOut(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        // Autoplay blocked — user can toggle manually
      });
    }

    setTimeout(() => {
      setEntered(true);
    }, 800);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <>
      {/* Entrance Overlay — always in DOM, hidden via CSS after enter */}
      {!entered && (
        <div className={`${styles.entranceOverlay} ${fadeOut ? styles.fadeOut : ''}`}>
          <Image
            src="/background.png"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className={styles.entranceOverlayFilter} />
          <h1 className={styles.entranceTitle}>Album Kenangan KKN</h1>
          <p className={styles.entranceSubtitle}>{siteConfig.locationName} • {siteConfig.period}</p>
          <div className="ornament-divider">
            <span className="ornament-icon">✦</span>
          </div>
          <button className={styles.enterBtn} onClick={handleEnter}>
            Masuk ke Album
          </button>
        </div>
      )}

      {/* Floating music player — always in DOM */}
      <div className={`${styles.playerWrapper} ${!entered ? styles.playerHidden : ''}`}>
        <span className={styles.label}>
          {playing ? '♪ Sedang Memutar' : '♪ Musik Mati'}
        </span>
        <button
          className={`${styles.playBtn} ${playing ? styles.playing : ''}`}
          onClick={toggleMusic}
          aria-label={playing ? 'Pause music' : 'Play music'}
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>
    </>
  );
}
