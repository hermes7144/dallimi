import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { client } from '@/service/sanity';

const FCM = admin.messaging();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const query = `*[_type == "marathon" && date == $tomorrow] { _id, name, participants[]-> }`;
  const marathons = await client.fetch(query, {
    tomorrow: tomorrow.toISOString(),
  });

  // 알림 전송
  for (const marathon of marathons) {
    for (const user of marathon.participants) {
      await sendNotification(user.fcmToken, `내일 ${marathon.name} 대회가 있습니다! 준비하세요.`);
    }
  }

  res.status(200).json({ message: "Notifications sent!" });
}

async function sendNotification(token: string, body: string) {
  const message = {
    notification: {
      title: "마라톤 알림",
      body: body,
    },
    token,
  };

  try {
    await FCM.send(message);
  } catch (error) {
    console.error("FCM 알림 전송 실패:", error);
  }
}

