'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';

interface DashboardStats {
  totalMembers: number;
  totalActivities: number;
  totalVotes: number;
  pendingChanges: number;
}

export default function ManageDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalActivities: 0,
    totalVotes: 0,
    pendingChanges: 0,
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    initDashboard();
  }, []);

  async function initDashboard() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/manage');
      return;
    }

    setToken(session.access_token);
    await fetchStats(session.access_token);
    setLoading(false);
  }

  async function fetchStats(accessToken: string) {
    try {
      const [membersRes, prokerRes, githubRes] = await Promise.all([
        fetch('/api/admin/members', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch('/api/admin/proker', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch('/api/admin/github', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      const membersData = await membersRes.json();
      const prokerData = await prokerRes.json();
      const githubData = await githubRes.json();

      setStats({
        totalMembers: membersData.members?.length || 0,
        totalActivities: prokerData.proker?.length || 0,
        totalVotes: 0,
        pendingChanges: githubData.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/manage');
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.navTitle}>Admin Panel</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.pageTitle}>Dashboard</h2>
            <p className={styles.pageSubtitle}>Kelola konten website KKN Pangyangan</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Anggota</p>
              <p className={styles.statValue}>{stats.totalMembers}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📋</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Kegiatan</p>
              <p className={styles.statValue}>{stats.totalActivities}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔄</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Perubahan Pending</p>
              <p className={styles.statValue}>{stats.pendingChanges}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Votes</p>
              <p className={styles.statValue}>{stats.totalVotes}</p>
            </div>
          </div>
        </div>

        <div className={styles.menuGrid}>
          <Link href="/manage/dashboard/members" className={styles.menuCard}>
            <div className={styles.menuIcon}>👥</div>
            <h3 className={styles.menuTitle}>Kelola Anggota</h3>
            <p className={styles.menuDesc}>Tambah, edit, atau hapus data anggota KKN</p>
          </Link>

          <Link href="/manage/dashboard/proker" className={styles.menuCard}>
            <div className={styles.menuIcon}>📋</div>
            <h3 className={styles.menuTitle}>Kelola Kegiatan</h3>
            <p className={styles.menuDesc}>Tambah, edit, atau hapus dokumentasi kegiatan</p>
          </Link>

          <Link href="/manage/dashboard/config" className={styles.menuCard}>
            <div className={styles.menuIcon}>⚙️</div>
            <h3 className={styles.menuTitle}>Konfigurasi Site</h3>
            <p className={styles.menuDesc}>Edit informasi umum website</p>
          </Link>

          <Link href="/manage/dashboard/votes" className={styles.menuCard}>
            <div className={styles.menuIcon}>📊</div>
            <h3 className={styles.menuTitle}>Statistik Voting</h3>
            <p className={styles.menuDesc}>Lihat hasil voting member</p>
          </Link>

          <Link href="/manage/dashboard/github" className={styles.menuCard}>
            <div className={styles.menuIcon}>🚀</div>
            <h3 className={styles.menuTitle}>Push ke GitHub</h3>
            <p className={styles.menuDesc}>Review dan push perubahan ke repository</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
