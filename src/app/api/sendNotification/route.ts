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

export async function GET() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // 내일 날짜
  const tomorrowStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD 포맷

  console.log(`🔔 Sending notifications for marathons on: ${tomorrowStr}`);

  // 내일 진행될 모든 마라톤 목록 가져오기
  const marathons = await client.fetch(
    `*[_type == "marathon" && date == $date]{
      _id,
      participants
    }`,
    { date: tomorrowStr }
  );

  if (marathons.length === 0) {
    console.log("🚫 No marathons found for tomorrow.");
    return;
  }

  // 마라톤 참가자들의 FCM 토큰을 추출
  for (const marathon of marathons) {
    if (!marathon.participants?.length) continue;

    // 참가자들의 FCM 토큰 조회
    const users = await client.fetch(
      `*[_type == "user" && _id in $ids]{ _id, fcmTokens }`,
      { ids: marathon.participants }
    );

    // FCM 토큰 추출 (모바일 + PC 토큰)
    const tokens = users.flatMap((user: FCMUser) => [user.fcmTokens?.mobile, user.fcmTokens?.pc]).filter(Boolean);
    
    if (!tokens.length) continue;

    // FCM 메시지 전송
    const payload = {
      notification: {
        title: "🏃‍♂️ 내일 마라톤 시작!",
        body: "내일 진행될 마라톤을 준비하세요!",
      },
    };

    // FCM 푸시 메시지 발송
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });
      console.log(`✅ Notifications sent to participants of marathon: ${marathon._id}`);
    } catch (error) {
      console.error(`🚨 Failed to send notifications for marathon ${marathon._id}:`, error);
    }
  }
}
