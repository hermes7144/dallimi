import { HomeUser } from '@/model/user';
import { useCallback } from 'react';
import useSWR from 'swr'

type Props = {
  isNotify: boolean;
  regions: string[];
  events: string[];
}

async function updateNotification(notification : Props) {
  return fetch('/api/notification', {
    method: 'PUT',
    body: JSON.stringify({ notification })
  }).then(res => res.json())
}


export default function useMe() {
  const { data: user, isLoading, error,  mutate }= useSWR<HomeUser>('/api/me');

  const setNotification = useCallback((notification: Props) => {
    return mutate(updateNotification(notification), { populateCache: false })
  }, [mutate])

  return { user, isLoading, error, setNotification }
}