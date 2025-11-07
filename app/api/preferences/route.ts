import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'dw_preferences';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function GET() {
  const cookie = cookies().get(COOKIE_NAME);

  if (!cookie) {
    return NextResponse.json({ interests: [] });
  }

  try {
    const data = JSON.parse(cookie.value);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ interests: [] });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const interests =
      Array.isArray(payload?.interests) &&
      payload.interests.every((item: unknown) => typeof item === 'string')
        ? payload.interests
        : [];

    const preferences = {
      interests,
      updatedAt: new Date().toISOString(),
    };

    cookies().set({
      name: COOKIE_NAME,
      value: JSON.stringify(preferences),
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: MAX_AGE,
      path: '/',
    });

    return NextResponse.json(preferences, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
