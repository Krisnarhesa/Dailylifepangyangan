'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './manage.module.css';

export default function ManageLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push('/manage/dashboard');
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push('/manage/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.manageContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.loginTitle}>Content Manager</h1>
        <p className={styles.loginSubtitle}>Dailylifepangyangan</p>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
