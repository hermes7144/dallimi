'use client'

import { useEffect, useState } from 'react';
import useMarathons from '@/hooks/useMarathons';
import dayjs from 'dayjs';
import MarathonListCard from '@/components/MarathonListCard';
import Link from 'next/link';
import { Marathon } from '@/model/marathon';
import CarouselCard from '@/components/CarouselCard';

export default function HomePage() {
  const { marathons } = useMarathons();
  const [notOpened, setNotOpened] = useState<Marathon[]>([]);
  const [recent, setRecent] = useState<Marathon[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!marathons) return;

    const now = dayjs();

    const notOpenedYet = marathons
    .filter((m) => m.startDate && dayjs(m.startDate).isAfter(now))
    .sort((a, b) => dayjs(a.startDate).diff(b.startDate)) // 접수 시작일 순
    .slice(0, 5);
  
    const recentMarathons = marathons
      .sort((a, b) => dayjs(b._createdAt).diff(a._createdAt))
      .slice(0, 5);

      console.log('notOpenedYet', notOpenedYet);
      

    setNotOpened(notOpenedYet);
    setRecent(recentMarathons);
  }, [marathons]);

  // 화면 크기 감지 (처음 로딩 시)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind 기준 md 미만
    };

    handleResize(); // 최초 실행
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderList = (list: Marathon[]) => (
    <ul className="space-y-4">
      {list.map((m) => (
        <MarathonListCard key={m.id} marathon={m} priority />
      ))}
    </ul>
  );

  return (
    <main className="p-4 space-y-12">
      <section>
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          접수 예정 마라톤
        </h2>
        {isMobile ? renderList(notOpened) : <CarouselCard>{notOpened.map((m) => <MarathonListCard key={m.id} marathon={m} priority />)}</CarouselCard>}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          신규 등록 마라톤
        </h2>
        {isMobile ? renderList(recent) : <CarouselCard>{recent.map((m) => <MarathonListCard key={m.id} marathon={m} priority />)}</CarouselCard>}
      </section>

      <div className="text-center pt-6">
        <Link
          href="/marathon"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          전체 마라톤 보기 →
        </Link>
      </div>
    </main>
  );
}
