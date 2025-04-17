import { withSessionUser } from '@/app/util/session';
import { notifyMarathon, unnotifyMarathon } from '@/service/notify';
import { getActiveUserTokens } from '@/service/user';
import admin from "firebase-admin";
import { NextRequest, NextResponse } from 'next/server';


// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Next.js API Route (Edge Runtime 미지원, Node.js 환경에서만 동작)
export async function POST(req: NextRequest) {
  console.log("🔍 Webhook received");

  try {
    const { name, region, events, url, image} = await req.json();    

    const tokens = await getActiveUserTokens(region, events);
    
    if (!tokens.length) {
      return new Response(
        JSON.stringify('토큰이 없어요') , {status: 500})
    }
    const message = {
      data: {
        title: name,
        body: `${region} ${events}`,
        url,
      },
      tokens: tokens, // 필터링된 유저들의 FCM 토큰
    };

    // FCM 전송
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log("✅ FCM sent successfully:", response);
    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error sending FCM:", error);
    return new Response(
      JSON.stringify(error) , {status: 500})
  }
}



export async function PUT(req: NextRequest) {
  return withSessionUser(async (user) => {
    const { id, notify } = await req.json();    
  
    if (!id || notify === undefined) {
      return new Response('Bad Request', { status: 400 });
    }
  
    const request = notify ? notifyMarathon : unnotifyMarathon;
  
    return request(id, user.id)
    .then(res => NextResponse.json(res))
    .catch(error => new Response(JSON.stringify(error) , {status: 500}))
  })
}
