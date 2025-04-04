import { memo } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

import { MarathonBadge } from './MarathonBadge';
import { FaRegCalendarAlt, FaWonSign } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { Marathon } from '@/model/marathon';
import Link from 'next/link';
import EventList from './EventList';
import useMe from '@/hooks/useMe';
import useMarathons from '@/hooks/useMarathons';
import ToggleButton from './ui/ToggleButton';
import { LuBellPlus, LuBellRing } from 'react-icons/lu';
import Image from 'next/image';


const MemoizedFaRegCalendarAlt = memo(FaRegCalendarAlt);
const MemoizedIoLocationSharp = memo(IoLocationSharp);
const MemoizedFaWonSign = memo(FaWonSign);

type Props = {
  marathon: Marathon;
  priority: boolean;
};

function MarathonListCard({ marathon, priority }: Props) {
  const { id, name, region, location, date, price, image, events, url, participants } = marathon;

  const { user } = useMe();
  const { setNotify } = useMarathons();
  const notified = user ? participants?.includes(user.id) : false;

  const handleNotify = (notify: boolean) => {
    user && setNotify(marathon, user.id, notify);
  };

  return (
<div>


<Link href={`/marathon/${id}`} className='block border border-gray-300 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer relative'>
  <Image
  src={image ?? ''} 
  alt={`${name} 이미지`} 
  width={300}
  height={200}
  className="hidden sm:block w-full aspect-[16/9] object-cover rounded-t-lg" 
/>
  <MarathonBadge position={'absolute'} marathon={marathon} />
  <div className='w-full flex flex-col p-2 sm:p-4 gap-1 text-sm sm:text-lg relative'>
      <div className='flex justify-between items-center gap-4'>
        <div>
        <MarathonBadge position={'absolute'} marathon={marathon} />
        <h2 className='w-60 font-semibold text-gray-800 truncate'>{name}</h2>
        </div>
        <ToggleButton
          title={notified ? 'notify' : 'unnotify'}
          toggled={notified}
          onToggle={(toggled, e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNotify(toggled);
          }}
          onIcon={<LuBellRing className='w-6 h-6' />}
          offIcon={<LuBellPlus  className='w-6 h-6' />}
        />
      </div>
      <div className='flex items-center text-gray-600'>
        <MemoizedFaRegCalendarAlt className='w-5 h-5 flex-shrink-0  mr-1' />
        <span>{dayjs(date).format('YYYY년 M월 D일 dddd')}</span>
      </div>
      <div className='flex items-center text-gray-600'>
        <MemoizedIoLocationSharp className='w-5 h-5 flex-shrink-0 mr-1' />
        <span className='truncate w-44 sm:w-full'>
          {region}, {location}
        </span>
      </div>
      <div className='flex items-center text-gray-600'>
        <MemoizedFaWonSign className='w-5 h-5 flex-shrink-0 mr-1' />
        {price.toLocaleString()}원 ~
      </div>
      <EventList events={events} />
  </div>
</Link>
    </div>
  );
}

export default memo(MarathonListCard);
