import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vpsConnections } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user's connections
    const connections = await db
      .select()
      .from(vpsConnections)
      .where(eq(vpsConnections.userId, payload.userId))
      .orderBy(desc(vpsConnections.createdAt));

    return NextResponse.json(connections);
  } catch (error) {
    console.error('Get connections error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, url } = await req.json();
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // Create connection
    await db.insert(vpsConnections).values({
      userId: payload.userId,
      name,
      url,
    });

    // Get all connections to return the new one
    const connections = await db
      .select()
      .from(vpsConnections)
      .where(eq(vpsConnections.userId, payload.userId))
      .orderBy(desc(vpsConnections.createdAt));

    // Return the most recent connection (the one we just created)
    return NextResponse.json(connections[0]);
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Delete connection (only if it belongs to the user)
    await db
      .delete(vpsConnections)
      .where(
        and(
          eq(vpsConnections.id, parseInt(id)),
          eq(vpsConnections.userId, payload.userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}