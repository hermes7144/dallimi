'use client';

import useMarathons from '@/hooks/useMarathons';
import GridSpninner from './ui/GridSpninner';
import MarathonListCard from './MarathonListCard';

export default function MarathonList() {
  const { marathons, isLoading: loading, error } = useMarathons();

  return (
    <section>
      {loading && (
        <div className='text-center mt-32'>
          <GridSpninner />
        </div>
      )}
      {marathons && (
        <ul className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-2'>
          {marathons.map((marathon, index) => (
            <li key={marathon.id} className='m-2'>
              <MarathonListCard marathon={marathon} priority={index < 2} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
