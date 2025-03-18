import { getMarathons } from '@/service/marathon';
import { NextResponse } from 'next/server';
import { withSessionUser } from '@/app/util/session';

export const dynamic = 'force-dynamic'; // 🔹 항상 최신 데이터 가져오기

export async function GET() {
  return withSessionUser(async (user) => {
    return getMarathons().then((data) => 
      NextResponse.json(data)
    )
})
}

