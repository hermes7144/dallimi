import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { client } from '@/service/sanity';
import { FCMUser } from '@/model/user';

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("@/config/firebaseAdmin.json")),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { marathonId } = await req.json();
    if (!marathonId) return NextResponse.json({ error: "마라톤 ID가 필요합니다." }, { status: 400 });

    // 마라톤 참가자들의 FCM 토큰 조회
    const users = await client.fetch(
      `*[_type == "user" && _id in *[_type == "marathon" && _id == $id][0].participants]{ _id, fcmTokens }`,
      { id: marathonId }
    );

    const tokens = users.flatMap((user: FCMUser) => [user.fcmTokens?.mobile, user.fcmTokens?.pc]).filter(Boolean);
    if (!tokens.length) {
      return NextResponse.json({ success: false, message: "No FCM tokens found." });
    }

    // FCM 메시지 전송
    const payload = {
      notification: {
        title: "🏃‍♂️ 마라톤 알림",
        body: "내일 마라톤이 시작됩니다! 준비하세요!",
      },
    };

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      ...payload,
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
