import { NextResponse } from 'next/server';
import { getUser } from '@/service/user';
import { withSessionUser } from '@/app/util/session';

export async function GET() {
  return withSessionUser(async (user) => {
    return getUser(user.id).then((data) => NextResponse.json(data));
  });
}