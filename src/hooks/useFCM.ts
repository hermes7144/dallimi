'use client'

import { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { initializeApp } from 'firebase/app';

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function useFCM() {
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      // Firebase 초기화
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      onMessage(messaging, (payload) => {
        console.log("포그라운드 메시지 수신:", payload);
        new Notification(payload.notification?.title || "알림", {
          body: payload.notification?.body || "",
          icon: payload.notification?.image || "",
        });
      });
    }
  }, []);
}
