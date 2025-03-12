importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: 'AIzaSyBz7CSzJEWs0fi3_DpYZntQtQVulHKIr_k',
  authDomain: 'dallimi.firebaseapp.com',
  projectId: 'dallimi',
  storageBucket: 'dallimi.firebasestorage.app',
  messagingSenderId: '859192662353',
  appId: '1:859192662353:web:8906009f70856f4ed85b70'
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm service worker가 실행되었습니다.");
  self.clients.claim(); // 모든 클라이언트(페이지)에서 새 서비스 워커를 제어하도록 함
});

self.addEventListener('push', function(event) {
  event.preventDefault(); // 기본 알림 표시 방지

  const message = event.data.json();  // FCM 메시지

  const title = message.notification.title + '백그라운드';
  const body = message.notification.body;
  const icon = message.notification?.icon;

  // const currentOrigin = self.location.origin;
  // const clickAction = currentOrigin === 'https://runal.netlify.app'
  //   ? 'https://runal.netlify.app/' :'https://dev-runal.netlify.app/';
  const clickAction = 'https://dallimi.vercel.app/';

  const options = {
    body,
    // notificationclick 있으면?
    data: {
      click_action: clickAction,
    },
    // 배지, 아이콘?
    icon: icon, 
    badge: '/icons/favicon-32x32.png', 
    vibrate: [200, 100, 200],  // 진동 패턴
    timestamp: Date.now(),
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();  // 알림을 닫습니다.

  const clickAction = event.notification.data.click_action;
  
  event.waitUntil(
    clients.openWindow(clickAction)
  );
});