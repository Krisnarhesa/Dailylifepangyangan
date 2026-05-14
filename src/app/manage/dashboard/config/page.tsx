'use client';

import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../dashboard.module.css';

interface SiteConfig {
  siteTitle: string;
  siteDescription: string;
  locationName: string;
  universityName: string;
  period: string;
  heroTagline: string;
  youtubeVideoId: string;
  bgmFile: string;
}

export default function ConfigManagementPage() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    initPage();
  }, []);

  async function initPage() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/manage');
      return;
    }
    setToken(session.access_token);
    await fetchConfig(session.access_token);
    setLoading(false);
  }

  async function fetchConfig(accessToken: string) {
    try {
      const res = await fetch('/api/admin/config', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setConfig(data.config);
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  }

  async function handleSave() {
    if (!config) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ config }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Konfigurasi berhasil disimpan!', 'success');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      showToast('Gagal menyimpan konfigurasi', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !config) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
    <div className={styles.dashboardContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/manage/dashboard" className={styles.navTitle}>
            ← Kembali ke Dashboard
          </Link>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2 className={styles.pageTitle}>Konfigurasi Site</h2>
          <p className={styles.pageSubtitle}>Edit informasi umum website</p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Judul Website</label>
              <input
                type="text"
                value={config.siteTitle}
                onChange={(e) =>
                  setConfig({ ...config, siteTitle: e.target.value })
                }
                placeholder="Ribuan Memori"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Deskripsi Website</label>
              <input
                type="text"
                value={config.siteDescription}
                onChange={(e) =>
                  setConfig({ ...config, siteDescription: e.target.value })
                }
                placeholder="Website kenang-kenangan..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nama Lokasi</label>
              <input
                type="text"
                value={config.locationName}
                onChange={(e) =>
                  setConfig({ ...config, locationName: e.target.value })
                }
                placeholder="Desa Pangyangan, Bali"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nama Universitas</label>
              <input
                type="text"
                value={config.universityName}
                onChange={(e) =>
                  setConfig({ ...config, universityName: e.target.value })
                }
                placeholder="Universitas Udayana"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Periode KKN</label>
              <input
                type="text"
                value={config.period}
                onChange={(e) =>
                  setConfig({ ...config, period: e.target.value })
                }
                placeholder="13 Juli - 25 Agustus 2025"
              />
            </div>

            <div className={styles.formGroup}>
              <label>YouTube Video ID</label>
              <input
                type="text"
                value={config.youtubeVideoId}
                onChange={(e) =>
                  setConfig({ ...config, youtubeVideoId: e.target.value })
                }
                placeholder="qnbsc-w7vYI"
              />
              <small style={{ color: '#718096', fontSize: 12 }}>
                ID dari URL: youtube.com/watch?v=<strong>qnbsc-w7vYI</strong>
              </small>
            </div>

            <div className={styles.formGroup}>
              <label>File BGM</label>
              <input
                type="text"
                value={config.bgmFile}
                onChange={(e) =>
                  setConfig({ ...config, bgmFile: e.target.value })
                }
                placeholder="/audio/bgm.mp3"
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Hero Tagline</label>
              <textarea
                value={config.heroTagline}
                onChange={(e) =>
                  setConfig({ ...config, heroTagline: e.target.value })
                }
                placeholder="Kenangan yang tak terlupakan..."
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              onClick={handleSave}
              className={styles.primaryButton}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
            </button>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h4>ℹ️ Informasi</h4>
          <ul>
            <li>Perubahan akan disimpan ke file siteConfig.json</li>
            <li>Jangan lupa push ke GitHub agar perubahan live</li>
            <li>Refresh website untuk melihat perubahan</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}
