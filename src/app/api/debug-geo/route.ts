// Debug endpoint pentru geolocalizare
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Colectează toate header-ele pentru debugging
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Obține informații IP specifice
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Colectează informații de geo din headere Vercel
  const vercelCountry = request.headers.get('x-vercel-ip-country') || 'none';
  const vercelRegion = request.headers.get('x-vercel-ip-country-region') || 'none';
  const vercelCity = request.headers.get('x-vercel-ip-city') || 'none';
  
  // Pentru test: detectăm IP-uri din România și Debug IP-uri
  const isRomanianIP = vercelCountry === 'RO' || ip.startsWith('109.163.') || ip.startsWith('193.231.');
  
  // Formatăm rezultatul
  const result = {
    timestamp: new Date().toISOString(),
    ip,
    headers,
    geo: {
      country: vercelCountry,
      region: vercelRegion,
      city: vercelCity,
    },
    detection: {
      isRomanianIP,
      redirectLocale: isRomanianIP ? 'ro' : 'en'
    }
  };

  return NextResponse.json(result);
}
