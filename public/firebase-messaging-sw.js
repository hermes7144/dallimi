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

messaging.onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    badge: '/icons/favicon-32x32.png',
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});