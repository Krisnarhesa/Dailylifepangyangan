'use client';

import FlowerDecor from '@/components/FlowerDecor/FlowerDecor';
import GalleryScroll from '@/components/GalleryScroll/GalleryScroll';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import TypingText from '@/components/TypingText/TypingText';
import siteConfig from '@/data/siteConfig.json';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/cover.png"
            alt={`Suasana KKN di ${siteConfig.locationName}`}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className={styles.heroBgOverlay} />
        </div>

        {/* Scattered flower background */}
        <FlowerDecor
          size="xlarge"
          blur="medium"
          opacity={0.18}
          rotation={25}
          delay={0}
          top="2%"
          right="0%"
        />
        <FlowerDecor
          size="large"
          blur="medium"
          opacity={0.14}
          rotation={70}
          delay={2}
          bottom="5%"
          left="2%"
        />
        <FlowerDecor
          size="medium"
          blur="light"
          opacity={0.12}
          rotation={140}
          delay={4}
          top="15%"
          left="5%"
        />
        <FlowerDecor
          size="small"
          blur="medium"
          opacity={0.1}
          rotation={200}
          delay={1}
          top="60%"
          right="8%"
        />
        <FlowerDecor
          size="xs"
          blur="light"
          opacity={0.15}
          rotation={310}
          delay={3}
          bottom="20%"
          left="15%"
        />
        <FlowerDecor
          size="medium"
          blur="heavy"
          opacity={0.08}
          rotation={50}
          delay={5}
          top="35%"
          right="20%"
        />

        <div className={styles.heroContent}>
          <TypingText
            tagName="h1"
            className={styles.heroTitle}
            text="Ribuan Memori"
            speed={80}
            showCursor={true}
          />
          <p className={styles.heroSubtitle}>
            {siteConfig.locationName} &bull; {siteConfig.universityName}
          </p>
          <p className={styles.heroTagline}>
            &ldquo;
            <TypingText
              tagName="span"
              text={siteConfig.heroTagline}
              speed={30}
              delay={1800}
            />
            &rdquo;
          </p>
          <div className={styles.heroActions}>
            <Link href="/members" className="btn-gold">
              Lihat Anggota ✦
            </Link>
            <Link href="/kegiatan" className="btn-outline">
              Lihat Kegiatan
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SAMBUTAN ===== */}
      <section className={`section ${styles.sectionRelative}`}>
        <FlowerDecor
          size="large"
          opacity={0.12}
          rotation={160}
          delay={0}
          top="-5%"
          left="-2%"
        />
        <FlowerDecor
          size="medium"
          opacity={0.15}
          rotation={45}
          delay={2}
          top="5%"
          right="3%"
        />
        <FlowerDecor
          size="small"
          opacity={0.18}
          rotation={250}
          delay={4}
          bottom="10%"
          left="8%"
        />
        <FlowerDecor
          size="xs"
          opacity={0.22}
          rotation={100}
          delay={1}
          top="50%"
          right="12%"
        />
        <FlowerDecor
          size="medium"
          blur="light"
          opacity={0.1}
          rotation={320}
          delay={3}
          bottom="-3%"
          right="0%"
        />
        <FlowerDecor
          size="xs"
          opacity={0.16}
          rotation={190}
          delay={5}
          top="30%"
          left="20%"
        />
        <div className="container">
          <ScrollReveal>
            <div className="section-heading">
              <span className="script-title">Kata Pengantar</span>
              <div className="ornament-divider">
                <span className="ornament-icon">✦</span>
              </div>
              <p className="subtitle">sambutan kami</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className={styles.sambutan}>
              <TypingText
                tagName="p"
                className={styles.sambutanText}
                text={`Selamat datang di album kenangan kami. Kuliah Kerja Nyata (KKN) adalah momen yang tak terlupakan sebuah perjalanan penuh pelajaran, kebersamaan, dan cerita yang membekas di hati. Semoga website ini bisa menjadi wadah untuk mengenang setiap tawa, peluh, dan senyuman selama kami mengabdi di ${siteConfig.locationName}.`}
                speed={50}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== GALLERY AUTO-SCROLL ===== */}
      <section className={`section ${styles.sectionRelative}`}>
        <FlowerDecor
          size="large"
          blur="light"
          opacity={0.1}
          rotation={40}
          delay={0}
          top="-5%"
          left="-2%"
        />
        <FlowerDecor
          size="medium"
          opacity={0.14}
          rotation={170}
          delay={2}
          top="10%"
          right="2%"
        />
        <FlowerDecor
          size="small"
          opacity={0.16}
          rotation={260}
          delay={4}
          bottom="5%"
          left="10%"
        />
        <FlowerDecor
          size="xs"
          blur="light"
          opacity={0.12}
          rotation={90}
          delay={1}
          bottom="20%"
          right="8%"
        />
        <div className="container">
          <ScrollReveal>
            <div className="section-heading">
              <span className="script-title">Galeri Kenangan</span>
              <div className="ornament-divider">
                <span className="ornament-icon">✦</span>
              </div>
              <p className="subtitle">momen terindah kami</p>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={0.1}>
          <GalleryScroll />
        </ScrollReveal>
      </section>

      {/* ===== VIDEO ===== */}
      <section className={`section ${styles.sectionRelative}`}>
        <FlowerDecor
          size="large"
          blur="light"
          opacity={0.1}
          rotation={55}
          delay={0}
          top="-8%"
          right="-2%"
        />
        <FlowerDecor
          size="medium"
          blur="medium"
          opacity={0.12}
          rotation={135}
          delay={2}
          bottom="5%"
          left="3%"
        />
        <FlowerDecor
          size="small"
          opacity={0.16}
          rotation={280}
          delay={4}
          top="20%"
          left="5%"
        />
        <FlowerDecor
          size="xs"
          blur="light"
          opacity={0.14}
          rotation={15}
          delay={1}
          bottom="25%"
          right="8%"
        />
        <FlowerDecor
          size="small"
          blur="heavy"
          opacity={0.08}
          rotation={180}
          delay={3}
          top="50%"
          right="18%"
        />
        <div className="container">
          <ScrollReveal>
            <div className="section-heading">
              <span className="script-title">Video Kenangan</span>
              <div className="ornament-divider">
                <span className="ornament-icon">✦</span>
              </div>
              <p className="subtitle">momen yang terabadikan</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className={styles.videoSection}>
              <div className={styles.videoWrapper}>
                <iframe
                  src={`https://www.youtube.com/embed/${siteConfig.youtubeVideoId}?rel=0`}
                  title="Video Kenangan KKN"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== LOKASI ===== */}
      <section className={`section ${styles.sectionRelative}`}>
        <FlowerDecor
          size="medium"
          blur="light"
          opacity={0.12}
          rotation={25}
          delay={0}
          top="-5%"
          left="2%"
        />
        <FlowerDecor
          size="small"
          opacity={0.14}
          rotation={200}
          delay={2}
          bottom="5%"
          right="5%"
        />
        <FlowerDecor
          size="xs"
          blur="light"
          opacity={0.16}
          rotation={130}
          delay={3}
          top="40%"
          left="8%"
        />
        <div className="container">
          <ScrollReveal>
            <div className="section-heading">
              <span className="script-title">Posko Kami</span>
              <div className="ornament-divider">
                <span className="ornament-icon">✦</span>
              </div>
              <p className="subtitle">{siteConfig.locationName}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className={styles.mapSection}>
              <div className={styles.mapWrapper}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.6809116985933!2d114.85904649999999!3d-8.4329625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd3d31f3d5c5cdf%3A0xd72a989f974ad2da!2sPosko%20KKN%20desa%20Pangyangan!5e0!3m2!1sid!2sid!4v1772456469637!5m2!1sid!2sid"
                  title="Lokasi Posko KKN"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
