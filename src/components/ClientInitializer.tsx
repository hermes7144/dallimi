"use client";

import { useEffect } from "react";
import { registerServiceWorker, requestNotificationPermission, sendFCMTokenToServer } from "@/service/notification";
import { useSession } from 'next-auth/react';

const ClientInitializer = () => {
  const { data: session } = useSession();
  const user = session?.user;
  useEffect(() => {
    if (user) {
      // registerServiceWorker();
      requestNotificationPermission().then((token) => {
        if (token) {
          sendFCMTokenToServer(token);
        }
      });
    }
  }, [user]);
  return null; // UI 요소를 렌더링하지 않음
};

export default ClientInitializer;
