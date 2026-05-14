import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { githubService } from '@/lib/admin/github';

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

    const pendingChanges = githubService.getPendingChanges();
    return NextResponse.json({ changes: pendingChanges, count: pendingChanges.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = await verifyAdminAuth(token);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const { commitMessage } = body;

    if (!commitMessage) {
      return NextResponse.json({ error: 'Commit message required' }, { status: 400 });
    }

    const result = await githubService.commitAndPush(commitMessage);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Changes pushed to GitHub successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = await verifyAdminAuth(token);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    githubService.clearPendingChanges();
    return NextResponse.json({ success: true, message: 'Pending changes cleared' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
