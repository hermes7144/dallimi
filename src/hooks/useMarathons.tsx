import { Marathon } from '@/model/marathon';
import useSWR from 'swr';

export default function useMarathons() {
  const { data: marathons, isLoading, error, mutate } =useSWR<Marathon[]>('/api/marathons');
  return { marathons, isLoading, error };
}