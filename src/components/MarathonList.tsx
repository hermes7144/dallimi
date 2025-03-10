'use client';

import useMarathons from '@/hooks/useMarathons';
import GridSpninner from './ui/GridSpninner';
import MarathonListCard from './MarathonListCard';

export default function MarathonList() {
  const { marathons, isLoading: loading, error } = useMarathons();

  return <section>
    {loading && <div className='text-center mt-32'><GridSpninner /></div>}
    {marathons &&
    <ul>
    {marathons.map((marathon, index) => <li key={marathon._id} className='mb-4'><MarathonListCard marathon={marathon} priority={index < 2}/></li>)}
  </ul>
  }
  </section>;
  }