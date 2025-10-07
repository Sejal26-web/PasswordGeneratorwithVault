import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const db = await getDatabase();
    const items = await db.collection('vault').find({ userId: payload.userId });

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { title, username, password, url, notes } = body;

    if (!title || !password) {
      return NextResponse.json(
        { error: 'Title and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection('vault').insertOne({
      userId: payload.userId,
      title,
      username: username || '',
      password,
      url: url || '',
      notes: notes || '',
      createdAt: new Date(),
    });

    const item = await db.collection('vault').findOne({ _id: result.insertedId });

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
