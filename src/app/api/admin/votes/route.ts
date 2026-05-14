import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { supabaseAdmin } from '@/lib/admin/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = await verifyAdminAuth(token);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { data: votes, error } = await supabaseAdmin
      .from('member_votes')
      .select('*')
      .order('votes_count', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const groupedByCategory: Record<string, any[]> = {};
    votes?.forEach((vote) => {
      if (!groupedByCategory[vote.category]) {
        groupedByCategory[vote.category] = [];
      }
      groupedByCategory[vote.category].push(vote);
    });

    return NextResponse.json({ votes, groupedByCategory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
