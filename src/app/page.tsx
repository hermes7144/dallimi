'use client';

import { useEffect, useMemo, useState } from 'react';
import useMarathons from '@/hooks/useMarathons';
import dayjs from 'dayjs';
import MarathonListCard from '@/components/MarathonListCard';
import Link from 'next/link';
import { Marathon } from '@/model/marathon';
import CarouselCard from '@/components/CarouselCard';
import SkeletonCard from '@/components/SkeletonCard';
import NotificationSummary from '@/components/NotificationSummary';

export default function HomePage() {
  const { isLoading, marathons } = useMarathons();
  const [isMobile, setIsMobile] = useState(false);
  const skeletonList = useMemo(() => new Array(5).fill(null), []);

  // 마라톤 데이터 처리
  const { notOpened, recent } = useMemo(() => {
    if (!marathons) return { notOpened: [], recent: [] };

    const now = dayjs();

    const notOpened = marathons
      .filter((m) => m.startDate && dayjs(m.startDate).isAfter(now))
      .sort((a, b) => dayjs(a.startDate).diff(b.startDate))
      .slice(0, 5);

    const recent = [...marathons]
      .sort((a, b) => dayjs(b._createdAt).diff(a._createdAt))
      .slice(0, 5);

    return { notOpened, recent };
  }, [marathons]);

  // 모바일 여부 감지
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 960);
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderSection = (title: string, data: Marathon[]) => (
    <section>
      <h2 className='text-xl font-bold mb-3 flex items-center gap-2'>{title}</h2>
      {isLoading || !marathons ? (
        isMobile ? (
          renderList(skeletonList)  // 모바일에서 스켈레톤 리스트
        ) : (
          <CarouselCard>
            {skeletonList.map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </CarouselCard>
        )
      ) : isMobile ? (
        renderList(data)  // 모바일에서 데이터 리스트
      ) : (
        <CarouselCard>
          {data.map((m) => (
            <MarathonListCard key={m.id} marathon={m} priority />
          ))}
        </CarouselCard>
      )}
    </section>
  );

  const renderList = (list: (Marathon | null)[]) => (
    <ul className='space-y-4'>
      {list.map((m, idx) =>
        m ? (
          <MarathonListCard key={m.id} marathon={m} priority />
        ) : (
          <SkeletonCard key={`skeleton-${idx}`} />
        )
      )}
    </ul>
  );

  return (
    <main className='p-4 space-y-12'>
      <NotificationSummary />
      {renderSection('접수 예정 마라톤', notOpened)}
      {renderSection('신규 등록 마라톤', recent)}

      <div className='text-center pt-6'>
        <Link
          href='/marathon'
          className='inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700'
        >
          전체 마라톤 보기 →
        </Link>
      </div>
    </main>
  );
}
