import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { readJsonFile, writeJsonFile } from '@/lib/admin/fileSystem';
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

    const proker = await readJsonFile('proker.json');
    return NextResponse.json({ proker });
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
    const { activity } = body;

    if (!activity || !activity.id || !activity.title) {
      return NextResponse.json({ error: 'Invalid activity data' }, { status: 400 });
    }

    const proker: any[] = await readJsonFile('proker.json');

    const exists = proker.find(p => p.id === activity.id);
    if (exists) {
      return NextResponse.json({ error: 'Activity ID already exists' }, { status: 400 });
    }

    proker.push(activity);
    await writeJsonFile('proker.json', proker);

    githubService.addChange({
      type: 'update',
      path: 'src/data/proker.json',
      content: JSON.stringify(proker, null, 2),
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { activity } = body;

    if (!activity || !activity.id) {
      return NextResponse.json({ error: 'Invalid activity data' }, { status: 400 });
    }

    const proker: any[] = await readJsonFile('proker.json');
    const index = proker.findIndex(p => p.id === activity.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    proker[index] = activity;
    await writeJsonFile('proker.json', proker);

    githubService.addChange({
      type: 'update',
      path: 'src/data/proker.json',
      content: JSON.stringify(proker, null, 2),
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true, activity });
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Activity ID required' }, { status: 400 });
    }

    const proker: any[] = await readJsonFile('proker.json');
    const filteredProker = proker.filter(p => p.id !== id);

    if (filteredProker.length === proker.length) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    await writeJsonFile('proker.json', filteredProker);

    githubService.addChange({
      type: 'update',
      path: 'src/data/proker.json',
      content: JSON.stringify(filteredProker, null, 2),
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
