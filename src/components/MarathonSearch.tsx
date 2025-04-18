'use client';

import useDebounce from '@/hooks/useDebounce';
import { Marathon } from '@/model/marathon';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';
import GridSpninner from './ui/GridSpninner';
import MarathonListCard from './MarathonListCard';

export default function MarathonSearch() {
  const [keyword, setKeyword] = useState('');
  const debouncedSearch = useDebounce(keyword);
  const { data: marathons, isLoading, error } = useSWR<Marathon[]>(`/api/marathons/${debouncedSearch}`);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className='w-full my-4 flex flex-col items-center m-3'>
      <form className='w-full mb-4' onSubmit={onSubmit}>
        <input className='w-full text-xl p-3 outline-none border border-gray-400' autoFocus type='text' placeholder='마라톤을 검색해주세요' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </form>
      {error && <p>무언가가 잘못 되었음</p>}
      {isLoading && <GridSpninner/>}
      {!isLoading && !error && marathons?.length === 0 && <p>찾는 대회가 없음</p>}
      <ul className='grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 w-full'>
      {marathons && marathons.map(marathon => <li key={marathon.id}>
          <MarathonListCard marathon={marathon} priority={false} />
        </li>)}
      </ul>
    </section>
  );
}

