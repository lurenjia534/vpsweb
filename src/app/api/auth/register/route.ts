import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword, generateToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    await db.insert(users).values({
      username,
      password: hashedPassword,
    });

    // Get the created user
    const newUser = await db.select().from(users).where(eq(users.username, username)).get();
    
    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      username: newUser.username,
    });

    return NextResponse.json({ token, username: newUser.username });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}