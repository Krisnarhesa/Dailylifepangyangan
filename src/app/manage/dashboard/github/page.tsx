'use client';

import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../dashboard.module.css';

interface PendingChange {
  type: 'add' | 'update' | 'delete';
  path: string;
}

export default function GitHubPushPage() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushing, setPushing] = useState(false);
  const [token, setToken] = useState('');
  const [commitMessage, setCommitMessage] = useState('');

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
    await fetchPendingChanges(session.access_token);
    setLoading(false);
  }

  async function fetchPendingChanges(accessToken: string) {
    try {
      const res = await fetch('/api/admin/github', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setPendingChanges(data.changes || []);
    } catch (error) {
      console.error('Error fetching pending changes:', error);
    }
  }

  async function handlePush() {
    if (!commitMessage.trim()) {
      alert('Mohon isi commit message');
      return;
    }

    if (!confirm(`Push ${pendingChanges.length} perubahan ke GitHub?`)) return;

    setPushing(true);
    try {
      const res = await fetch('/api/admin/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commitMessage }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Perubahan berhasil di-push ke GitHub!', 'success');
        setCommitMessage('');
        await fetchPendingChanges(token);
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error pushing to GitHub:', error);
      showToast('Gagal push ke GitHub', 'error');
    } finally {
      setPushing(false);
    }
  }

  async function handleClear() {
    if (!confirm('Hapus semua perubahan pending?')) return;

    try {
      const res = await fetch('/api/admin/github', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        showToast('Perubahan pending berhasil dihapus!', 'success');
        await fetchPendingChanges(token);
      }
    } catch (error) {
      console.error('Error clearing changes:', error);
      showToast('Gagal menghapus perubahan', 'error');
    }
  }

  if (loading) {
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
          <h2 className={styles.pageTitle}>Push ke GitHub</h2>
          <p className={styles.pageSubtitle}>
            Review dan push perubahan ke repository
          </p>
        </div>

        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>
            Perubahan Pending ({pendingChanges.length})
          </h3>

          {pendingChanges.length === 0 ? (
            <p style={{ color: '#718096', textAlign: 'center', padding: '40px 0' }}>
              Tidak ada perubahan pending
            </p>
          ) : (
            <>
              <div className={styles.changesList}>
                {pendingChanges.map((change, idx) => (
                  <div key={idx} className={styles.changeItem}>
                    <span
                      className={styles.changeType}
                      data-type={change.type}
                    >
                      {change.type}
                    </span>
                    <span className={styles.changePath}>{change.path}</span>
                  </div>
                ))}
              </div>

              <div className={styles.formGroup} style={{ marginTop: 24 }}>
                <label>Commit Message</label>
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="chore: update member data and images"
                  rows={3}
                  style={{ width: '100%' }}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  onClick={handlePush}
                  className={styles.primaryButton}
                  disabled={pushing || !commitMessage.trim()}
                >
                  {pushing ? 'Pushing...' : '🚀 Push ke GitHub'}
                </button>
                <button
                  onClick={handleClear}
                  className={styles.deleteButton}
                  disabled={pushing}
                >
                  Hapus Semua
                </button>
              </div>
            </>
          )}
        </div>

        <div className={styles.infoCard}>
          <h4>ℹ️ Informasi</h4>
          <ul>
            <li>Semua perubahan (upload gambar, edit data) akan dikumpulkan di sini</li>
            <li>Review perubahan sebelum push ke GitHub</li>
            <li>Setelah push, perubahan akan langsung live di website</li>
            <li>Pastikan commit message jelas dan deskriptif</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}
