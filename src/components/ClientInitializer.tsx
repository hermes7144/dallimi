"use client";

import { useEffect } from "react";
import { requestNotificationPermission, sendFCMTokenToServer } from "@/service/notification";
import { useSession } from "next-auth/react";

const ClientInitializer = () => {
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });

    if (user?.id) {
      requestNotificationPermission().then((token) => {
        if (token) {
          // 모바일 또는 PC 자동 판별
          const isMobile = /Mobi|Android/i.test(navigator.userAgent);
          const deviceType = isMobile ? "mobile" : "pc";

          sendFCMTokenToServer(user.id, token, deviceType);
        }
      });
    }
  }, [user]);

  return null;
};

export default ClientInitializer;
