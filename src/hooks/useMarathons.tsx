import { Marathon } from '@/model/marathon';
import { useCallback } from 'react';
import useSWR from 'swr';

async function updateNotify(id: string, notify: boolean) {
  return fetch('/api/notify', {
    method: 'PUT',
    body: JSON.stringify({ id, notify }),
  }).then((res) => res.json());
}

export default function useMarathons() {
  const { data: marathons, isLoading, error, mutate } =useSWR<Marathon[]>('/api/marathons');

  const setNotify = useCallback(
    (marathon: Marathon, id: string, notify: boolean) => {
      

      const newParticipant = {
        ...marathon,
        participants: notify ? [...marathon.participants, id] : marathon.participants.filter((item) => item !== id),
      };
      const newParticipants = marathons?.map((p) => (p.id === marathon.id ? newParticipant : p));

      return mutate(updateNotify(id= marathon.id, notify), {
        optimisticData: newParticipants,
        populateCache: false,
        revalidate: false,
        rollbackOnError: true,
      });
    },
    [mutate, marathons]
  );

  return { marathons, isLoading, error, setNotify };
}
