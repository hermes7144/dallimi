import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("🔔 알림 권한 허용됨");

      // Service Worker 등록
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("✅ Service Worker 등록 성공:", registration);

      // FCM 토큰 가져오기
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration, // ✅ 여기 추가
      });

      console.log("🔥 FCM 토큰:", token);
      return token;
    } else {
      console.warn("🚫 알림 권한 거부됨");
    }
  } catch (error) {
    console.error("❌ FCM 토큰 가져오기 실패:", error);
  }
};


// 서버로 FCM 토큰 전송
export const sendFCMTokenToServer = async (id: string, token: string, deviceType: 'mobile' | 'pc') => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, token, deviceType }),
    });

    const data = await response.json();
    console.log(`📨 FCM Token Sent for ${deviceType}:`, data);
  } catch (error) {
    console.error('❌ Error sending FCM Token:', error);
  }
};

// export function registerServiceWorker() {
//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function () {
//       const serviceWorkerFile = '/firebase-messaging-sw.js';
//       navigator.serviceWorker
//         .register(serviceWorkerFile)
//         .then(function (registration) {
//           console.log('Service Worker가 scope에 등록되었습니다.:', registration.scope);
//         })
//         .catch(function (err) {
//           console.log('Service Worker 등록 실패:', err);

//         });
//     });
//   }
// }