import { NextRequest, NextResponse } from 'next/server';
import { getMarathons } from '@/service/marathon';
import { withSessionUser } from '@/app/util/session';

type Context = {
  params: { keyword: string };
};

export async function GET(request: NextRequest, context: Context) {
  const rawKeyword = context.params.keyword;
  const keyword = decodeURIComponent(rawKeyword);

  return withSessionUser(async () => {
    return getMarathons(keyword).then((data) => NextResponse.json(data));
  });
}

// 이걸 검색때 하는걸로 변경해야행

