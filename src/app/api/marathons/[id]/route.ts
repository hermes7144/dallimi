import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getMarathon } from '@/service/marathon';
import { withSessionUser } from '@/app/util/session';

type Context = {
  params: {id: string}
}

export async function GET(request: NextRequest, context: Context) {
  return withSessionUser(async (user) => {
    return getMarathon(context.params.id).then((data) => 
      NextResponse.json(data)
    )
})
}

