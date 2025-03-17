import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getMarathon } from '@/service/marathon';

type Context = {
  params: {id: string}
}

export async function GET(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  console.log('session', session);
  
  
  if (!user) {
    return new Response('Authentication Error', { status: 401})
  }

  return getMarathon(context.params.id).then((data) => 
    NextResponse.json(data)
  )
}

