import { HomeUser } from '@/model/user';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import useSWR from 'swr'

type Props = {
  isEnabled: boolean;
  regions: string[];
  events: string[];
}

async function updateNotification(notification : Props) {
  return fetch('/api/user/notification', {
    method: 'PUT',
    body: JSON.stringify({ notification })
  }).then(res => res.json())
}


export default function useMe() {
  const { data: session, status } = useSession();

  const isLoggedIn = status === 'authenticated';

  const { data: user, isLoading, error, mutate } = useSWR<HomeUser>(
    isLoggedIn ? '/api/me' : null
  );

  const setNotification = useCallback((notification: Props) => {
    return mutate(updateNotification(notification), { populateCache: false })
  }, [mutate])

  return { user, isLoading, error, setNotification }
}