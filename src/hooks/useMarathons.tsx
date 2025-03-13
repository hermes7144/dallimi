import { Marathon } from '@/model/marathon';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useMarathons() {
  const { data: marathons, isLoading, error, mutate } =useSWR('/api/marathons', fetcher, {
    revalidateOnMount: true, // 마운트될 때마다 새로 요청
    // revalidateOnFocus: true, // 페이지 포커스 시 자동 리프레시
    revalidateOnReconnect: true,
  });
  return { marathons, isLoading, error };
}