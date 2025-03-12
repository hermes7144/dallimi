import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ✅ Firebase 초기화
const app = initializeApp(firebaseConfig);
let messaging: Messaging | null = null;

// ✅ 클라이언트 환경에서만 Firebase Messaging 가져오기
export const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  }
  return null;
};

// ✅ 알림 권한 요청 및 FCM 토큰 가져오기
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("🚫 알림 권한 거부됨");
      return;
    }

    console.log("🔔 알림 권한 허용됨");

    // Service Worker 등록
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("✅ Service Worker 등록 성공:", registration);

    // FCM Messaging 가져오기
    const messaging = getFirebaseMessaging();
    if (!messaging) {
      throw new Error("Firebase Messaging을 가져올 수 없음");
    }

    // FCM 토큰 가져오기
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration, // ✅ 추가
    });

    console.log("🔥 FCM 토큰:", token);
    return token;
  } catch (error) {
    console.error("❌ FCM 토큰 가져오기 실패:", error);
  }
};

// ✅ 서버로 FCM 토큰 전송
export const sendFCMTokenToServer = async (id: string, token: string, deviceType: "mobile" | "pc") => {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, token, deviceType }),
    });

    const data = await response.json();
    console.log(`📨 FCM Token Sent for ${deviceType}:`, data);
  } catch (error) {
    console.error("❌ Error sending FCM Token:", error);
  }
};

// ✅ 포그라운드 메시지 수신 설정
export const setupOnMessageListener = () => {
  const messaging = getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("📩 포그라운드 메시지 수신:", payload);
    new Notification(payload.notification?.title + '포그라운드' || "알림", {
      body: payload.notification?.body || "",
      icon: payload.notification?.image || "",
    });
  });
};
