import { onMessage } from 'firebase/messaging';

const messaging = getMessaging();

onMessage(messaging, (payload) => {
  console.log("포그라운드 메시지 수신:", payload);

  // 알림 표시 (서비스 워커가 아닌 클라이언트에서)
  new Notification('title', {
    body: 'body',
    icon: ''
  });
});