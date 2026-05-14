import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { saveImageToLocal } from '@/lib/admin/fileSystem';
import { githubService } from '@/lib/admin/github';
import fs from 'fs/promises';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetPath = formData.get('targetPath') as string;
    const optimize = formData.get('optimize') === 'true';

    if (!file || !targetPath) {
      return NextResponse.json({ error: 'File and targetPath required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await saveImageToLocal(buffer, targetPath, optimize);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const fileContent = await fs.readFile(`public/${targetPath}`);
    const base64Content = fileContent.toString('base64');

    githubService.addChange({
      type: 'add',
      path: `public/${targetPath}`,
      content: base64Content,
      encoding: 'base64',
    });

    return NextResponse.json({ success: true, path: result.path });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
