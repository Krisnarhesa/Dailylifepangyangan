import FlowerDecor from '@/components/FlowerDecor/FlowerDecor';
import siteConfig from '@/data/siteConfig.json';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <FlowerDecor size="small" blur="medium" opacity={0.12} rotation={40} delay={0} top="-10%" left="3%" />
      <FlowerDecor size="xs" blur="light" opacity={0.14} rotation={160} delay={2} top="15%" right="5%" />
      <FlowerDecor size="small" blur="medium" opacity={0.10} rotation={310} delay={3} bottom="-10%" right="2%" />

      <div className={styles.footerInner}>
        <p className={styles.footerTitle}>Our Journey</p>
        <p className={styles.footerLocation}>
          {siteConfig.universityName} &bull; {siteConfig.locationName}
        </p>

        <div className={styles.footerDivider}>
          <span className={styles.footerDividerIcon}>✦</span>
        </div>

        <p className={styles.footerPeriod}>{siteConfig.period}</p>

        <div className={styles.socialSection}>
          <p className={styles.socialTitle}>Our Social Media</p>
          <div className={styles.socialLinks}>
            <a
              href="https://www.instagram.com/dailylife.pangyangan/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@dailylife.pangyangan"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.49a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.17a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.6z"/>
              </svg>
            </a>
          </div>
        </div>

        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} - Dibuat dengan <span>❤</span> untuk kenang-kenangan KKN
        </p>
      </div>
    </footer>
  );
}
