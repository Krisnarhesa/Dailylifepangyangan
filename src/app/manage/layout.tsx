'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/manage');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session && window.location.pathname !== '/manage') {
      router.push('/manage');
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
