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

    const config = await readJsonFile('siteConfig.json');
    return NextResponse.json({ config });
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
    const { config } = body;

    if (!config) {
      return NextResponse.json({ error: 'Invalid config data' }, { status: 400 });
    }

    await writeJsonFile('siteConfig.json', config);

    githubService.addChange({
      type: 'update',
      path: 'src/data/siteConfig.json',
      content: JSON.stringify(config, null, 2),
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
