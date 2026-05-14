'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../dashboard.module.css';

interface VoteData {
  member_name: string;
  category: string;
  votes_count: number;
}

export default function VotesStatisticsPage() {
  const router = useRouter();
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [groupedVotes, setGroupedVotes] = useState<Record<string, VoteData[]>>({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    await fetchVotes(session.access_token);
    setLoading(false);
  }

  async function fetchVotes(accessToken: string) {
    try {
      const res = await fetch('/api/admin/votes', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setVotes(data.votes || []);
      setGroupedVotes(data.groupedByCategory || {});
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  }

  const categories = Object.keys(groupedVotes);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
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
          <h2 className={styles.pageTitle}>Statistik Voting</h2>
          <p className={styles.pageSubtitle}>Hasil voting member dalam berbagai kategori</p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formGroup}>
            <label>Filter Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '10px', fontSize: 16, borderRadius: 8, border: '2px solid #e2e8f0' }}
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({groupedVotes[cat].length} votes)
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCategory === 'all' ? (
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <div key={category} className={styles.categoryCard}>
                <h3 className={styles.categoryTitle}>{category}</h3>
                <div className={styles.votesList}>
                  {groupedVotes[category].slice(0, 5).map((vote, idx) => (
                    <div key={idx} className={styles.voteItem}>
                      <span className={styles.voteRank}>#{idx + 1}</span>
                      <span className={styles.voteName}>{vote.member_name}</span>
                      <span className={styles.voteCount}>{vote.votes_count} votes</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{selectedCategory}</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Nama Member</th>
                    <th>Jumlah Vote</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedVotes[selectedCategory]?.map((vote, idx) => (
                    <tr key={idx}>
                      <td>#{idx + 1}</td>
                      <td>{vote.member_name}</td>
                      <td><strong>{vote.votes_count}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {votes.length === 0 && (
          <div className={styles.infoCard}>
            <p style={{ textAlign: 'center', color: '#718096' }}>
              Belum ada data voting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
