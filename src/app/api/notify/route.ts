import { getActiveUserTokens } from '@/service/user';
import admin from "firebase-admin";

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
export async function POST(req: Request) {
  console.log("🔍 Webhook received");

  try {
    const { name, region, events} = await req.json();    

    const tokens = await getActiveUserTokens(region, events);
    
    if (!tokens.length) return new Response(
      JSON.stringify({ success: false, error: '토큰이없어요' }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
    const message = {
      notification: {
        title: name,
        body: `${region} ${events}`,
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
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
