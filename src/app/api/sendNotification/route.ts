import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { client } from '@/service/sanity';
import { FCMUser } from '@/model/user';

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

export async function GET() {
  const today = new Date().toISOString().split("T")[0];     // YYYY-MM-DD (오늘)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD (내일)

  console.log(`🔔 Sending notifications for marathons on: ${tomorrowStr} or registration on: ${today}`);

  // 내일 개최되는 마라톤 또는 오늘 신청 시작하는 마라톤 가져오기
  const marathons = await client.fetch(
    `*[_type == "marathon" && (date == $tomorrow || startDate == $today)]{
      _id,
      date,
      startDate,
      participants
    }`,
    { today, tomorrow: tomorrowStr }
  );

  if (marathons.length === 0) {
    console.log("🚫 No marathons found for notification.");
    return NextResponse.json({ ok: true });
  }

  let notificationSent = false;

  for (const marathon of marathons) {
    const users = await client.fetch(
      `*[_type == "user" && _id in *[_type == "marathon" && _id == $id].participants[]._ref]{
        _id,
        fcmTokens
      }`,
      { id: marathon._id }
    );

    // FCM 토큰 추출 (모바일 + PC 토큰)
    const tokens = users.flatMap((user: FCMUser) => [
      user.fcmTokens?.mobile,
      user.fcmTokens?.pc
    ]).filter(Boolean);

    if (!tokens.length) continue;

    // 마라톤 개최 알림 or 참가 신청 알림 분기 처리
    let title, body;
    if (marathon.date === tomorrowStr) {
      title = `🏃‍♂️ 내일 ${marathon.name} 시작!`;
      body = "내일 진행될 마라톤을 준비하세요!";
    } else if (marathon.startDate === today) {
      title = `📢 ${marathon.name} 신청 시작!`;
      body = "오늘부터 마라톤 참가 신청이 가능합니다!";
    } else {
      continue;
    }

    // FCM 메시지 전송
    const payload = {
      notification: { title, body },
    };

    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });
      console.log(`✅ Notifications sent to participants of marathon: ${marathon._id}`);
      notificationSent = true;
    } catch (error) {
      console.error("❌ Failed to send notifications:", error);
    }
  }

  if (!notificationSent) {
    return NextResponse.json({ ok: false, message: "No notifications were sent." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
