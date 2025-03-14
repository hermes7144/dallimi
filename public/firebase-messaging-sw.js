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

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);

  // 알림을 클릭하면 새로운 탭이나 창을 여는 동작
  const notification = event.notification;
  // const url = notification.data.url || '/'; // 기본 URL은 홈페이지로 설정
  const url = 'https://dallimi.vercel.app/';

  // 알림을 클릭했을 때 기존 탭이 있으면 포커스를 맞추고 없으면 새 탭을 엶
  event.notification.close(); // 알림 닫기
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // 이미 열린 클라이언트가 있으면 그 클라이언트로 포커스 이동
      const client = clientList.find((client) => client.url === url);
      if (client) {
        return client.focus();
      } else {
        // 없으면 새 탭을 엶
        return clients.openWindow(url);
      }
    })
  );
});

// messaging.onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     badge: '/icons/favicon-32x32.png',
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });