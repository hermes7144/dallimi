import { NextRequest, NextResponse } from 'next/server';
import { withSessionUser } from '@/app/util/session';
import { setNotification } from '@/service/user';

export async function PUT(req: NextRequest) {
  return withSessionUser(async (user) => {
  const { notification } = await req.json();

  if (!notification) {
    return new Response('Bad Request', { status: 400 });
  }

  return setNotification(user.id, notification)
  .then(res => NextResponse.json(res))
  .catch(error => new Response(JSON.stringify(error) , {status: 500}))
  });
}
