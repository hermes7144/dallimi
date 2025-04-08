'use client';

import useMarathons from '@/hooks/useMarathons';
import GridSpninner from './ui/GridSpninner';
import MarathonListCard from './MarathonListCard';
import { useState } from 'react';
import dayjs from 'dayjs';

type StatusType = 'open' | 'close' | null;

const options: { label: string; value: StatusType }[] = [
  { label: '전체', value: null },
  { label: '모집중/예정', value: 'open' },
  { label: '모집종료', value: 'close' },
];

export default function MarathonList() {
  const { marathons, isLoading: loading, error } = useMarathons();
  const [status, setStatus] = useState<StatusType>('open');
  const [regionGroup, setRegionGroup] = useState('');
  const [month, setMonth] = useState('');
  const [event, setEvent] = useState('');

  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

  const now = dayjs();
  const regionGroups = {
    서울: ['서울'],
    경기: ['경기', '인천'],
    충청: ['충북', '충남', '대전', '세종'],
    전라: ['전북', '전남', '광주'],
    경상: ['경북', '경남', '대구', '부산', '울산'],
    기타: ['강원', '제주']
  };

  const filteredMarathons = marathons?.filter((marathon) => {
    const marathonDate = dayjs(marathon.date);
    const marathonMonth = marathonDate.month() + 1;

    // 모집 종료 상태 계산
    const isExplicitlyClosed = marathon.isClosed ?? false; // undefined는 false 취급
    const isTimeOver = marathon.endDate ? dayjs(marathon.endDate).isBefore(now, 'day') : false;
    const isClosedStatus = isExplicitlyClosed || isTimeOver;

    // 상태 필터 조건 체크
    const matchesStatus =
      status === null // 전체
        ? true
        : status === 'open'
        ? !isClosedStatus
        : isClosedStatus;

    // 나머지 필터 조건
    const matchesEvent = event === '' || marathon.events.includes(event);
    const matchesMonth = month === '' || String(marathonMonth) === month;
    const selectedRegions = regionGroup
    ? regionGroups[regionGroup as keyof typeof regionGroups]
    : null;
    
    const matchesRegion = !selectedRegions || selectedRegions.some((r) => marathon.region.includes(r));

    return matchesStatus && matchesEvent && matchesMonth && matchesRegion;
  });

  return (
    <section>
    <header className="mt-4 px-4 py-5 bg-white shadow-sm">
      <div className="mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">마라톤</h1>
  
        <div className="flex flex-col">
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">모집 상태</h2>
            <div className="flex flex-wrap gap-2">
              {options.map(({ label, value }) => (
                <button
                  key={String(value ?? 'all')}
                  onClick={() => setStatus(value)}
                  className={`px-1.5 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium border transition ${
                    status === value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
  
          {/* 거리 */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">거리</h2>
            <div className="flex flex-wrap gap-2">
              {['전체', 'Full', 'Half', '10km', '5km'].map((label) => {
                const val = label === '전체' ? '' : label;
                return (
                  <button
                    key={label}
                    onClick={() => setEvent(val)}
                    className={`px-1.5 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm  font-medium border transition ${
                      event === val
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
  
          {/* 지역 */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">지역</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRegionGroup('')}
                className={`px-1.5 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm  border transition ${
                  regionGroup === ''
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                전체
              </button>
              {Object.keys(regionGroups).map((group) => (
                <button
                  key={group}
                  onClick={() => setRegionGroup(group)}
                  className={`px-1.5 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm  border transition ${
                    regionGroup === group
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
  
          {/* 월 선택 */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">월</h2>
            <select
              className="w-full bg-gray-100 text-sm rounded-md px-3 py-2 border border-gray-300"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">전체</option>
              {months.map((m) => (
                <option key={m} value={parseInt(m)}>
                  {m}월
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  
    {/* 로딩 중 */}
    {loading && (
      <div className="text-center mt-32">
        <GridSpninner />
      </div>
    )}
  
    {/* 목록 */}
    {filteredMarathons && (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {filteredMarathons.map((marathon, index) => (
          <li key={marathon.id}>
            <MarathonListCard marathon={marathon} priority={index < 2} />
          </li>
        ))}
      </ul>
    )}
  </section>

  );
}
