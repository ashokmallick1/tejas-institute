import { NextRequest, NextResponse } from 'next/server';
import { DEMO_PROFILES } from '@/lib/data/mock-store';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, roleKey } = body;

    let matchedUser: UserProfile | null = null;

    if (roleKey && DEMO_PROFILES[roleKey]) {
      matchedUser = DEMO_PROFILES[roleKey];
    } else if (email) {
      const emailLower = email.toLowerCase();
      // Match by demo email or prefix
      const found = Object.values(DEMO_PROFILES).find(
        (p) => p.email.toLowerCase() === emailLower || emailLower.startsWith(p.role.toLowerCase())
      );
      matchedUser = found || DEMO_PROFILES.student;
    } else {
      matchedUser = DEMO_PROFILES.student;
    }

    // Generate stateless mobile access & refresh tokens
    const timestamp = Date.now();
    const accessTokenPayload = Buffer.from(
      JSON.stringify({
        sub: matchedUser.id,
        email: matchedUser.email,
        role: matchedUser.role,
        iat: Math.floor(timestamp / 1000),
        exp: Math.floor(timestamp / 1000) + 86400 * 30, // 30 days
        iss: 'tejas.bhashaai.in',
      })
    ).toString('base64');

    const accessToken = `tejas_mob_${accessTokenPayload}`;
    const refreshToken = `tejas_rf_${Buffer.from(`${matchedUser.id}:${timestamp}:${Math.random()}`).toString('base64')}`;

    return NextResponse.json({
      success: true,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 86400 * 30,
      token_type: 'Bearer',
      user: matchedUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
