import { NextResponse } from 'next/server';

/**
 * Universal CORS and Mobile Headers for TEJAS API v1
 * Allows mobile applications (Expo, React Native, iOS, Android, Flutter)
 * and subdomains (crm, lms, admin) to consume the API securely.
 */
export function corsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Client-Version, X-Platform, X-Subdomain',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
      'X-API-Version': '1.0.0',
    },
  });
}
