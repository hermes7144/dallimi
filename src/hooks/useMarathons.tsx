import { Marathon } from '@/model/marathon';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useMarathons() {
  const { data: marathons, isLoading, error, mutate } =useSWR<Marathon[]>('/api/marathons', fetcher, {
    refreshInterval: 30000, // 30초마다 데이터를 자동으로 갱신
  });
  return { marathons, isLoading, error };
}