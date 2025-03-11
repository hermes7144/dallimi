import { NextResponse } from 'next/server';
import { saveFCMToken } from '@/service/fcmService';

export async function POST(req: Request) {
  try {
    const { id, token, deviceType } = await req.json();

    if (!id || !token || !deviceType) {
      return NextResponse.json({ success: false, message: 'User ID, Token, and DeviceType are required' }, { status: 400 });
    }

    if (deviceType !== 'mobile' && deviceType !== 'pc') {
      return NextResponse.json({ success: false, message: 'Invalid device type' }, { status: 400 });
    }

    const result = await saveFCMToken(id, token, deviceType);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error('❌ Error in API route:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
