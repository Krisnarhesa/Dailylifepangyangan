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

    const members = await readJsonFile('members.json');
    return NextResponse.json({ members });
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
    const { member } = body;

    if (!member || !member.name || !member.role) {
      return NextResponse.json({ error: 'Invalid member data' }, { status: 400 });
    }

    const members: any[] = await readJsonFile('members.json');

    const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    const newMember = { ...member, id: newId };

    members.push(newMember);
    await writeJsonFile('members.json', members);

    githubService.addChange({
      type: 'update',
      path: 'src/data/members.json',
      content: JSON.stringify(members, null, 2),
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true, member: newMember });
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
    const { member } = body;

    if (!member || !member.id) {
      return NextResponse.json({ error: 'Invalid member data' }, { status: 400 });
    }

    const members: any[] = await readJsonFile('members.json');
    const index = members.findIndex(m => m.id === member.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    members[index] = member;
    await writeJsonFile('members.json', members);

    githubService.addChange({
      type: 'update',
      path: 'src/data/members.json',
      content: JSON.stringify(members, null, 2),
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true, member });
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
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const members: any[] = await readJsonFile('members.json');
    const filteredMembers = members.filter(m => m.id !== parseInt(id));

    if (filteredMembers.length === members.length) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await writeJsonFile('members.json', filteredMembers);

    githubService.addChange({
      type: 'update',
      path: 'src/data/members.json',
      content: JSON.stringify(filteredMembers, null, 2),
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
