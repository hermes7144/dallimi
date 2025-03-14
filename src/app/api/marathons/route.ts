import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getMarathons } from '@/service/marathon';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // 🔹 항상 최신 데이터 가져오기

export async function GET() {
  // const session = await getServerSession(authOptions);
  // const user = session?.user;
  
  // if (!user) {
  //   return new Response('Authentication Error', { status: 401})
  // }

  // const username = user.email?.split('@')[0];

  return getMarathons().then((data) => 
    NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' }, // Vercel 캐싱 비활성화
    })
  )
}
