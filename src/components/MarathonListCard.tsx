'use client';

import { memo } from 'react';
import dayjs from 'dayjs';
// import EventList from './EventList';
// import NotificationButton from './NotificationButton';
import { MarathonBadge } from './MarathonBadge';
import { FaRegCalendarAlt, FaWonSign } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { Marathon } from '@/model/marathon';
import Link from 'next/link';
import EventList from './EventList';


const MemoizedFaRegCalendarAlt = memo(FaRegCalendarAlt);
const MemoizedIoLocationSharp = memo(IoLocationSharp);
const MemoizedFaWonSign = memo(FaWonSign);

type Props = {
  marathon: Marathon;
  priority: boolean;
};

function MarathonListCard({ marathon, priority }: Props) {
  const {_id, name, region, location, date, price, image, events, url } = marathon;

  return (
    //  onClick={() => window.open(marathon.url)}
    <Link href={`/marathon/${_id}`} className='bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer relative'>
      <img src={image} alt={`${name} 이미지`} className="hidden sm:block w-full aspect-[16/9] object-fill rounded-t-lg" />
      <MarathonBadge marathon={marathon} />
      <div className='w-full flex flex-col p-2 sm:p-4 gap-1 text-sm sm:text-lg relative'>
          <div className='flex justify-between items-center'>
            <h2 className='w-60 font-semibold text-gray-800 truncate'>{name}</h2>
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
          {/* <NotificationButton marathonId={marathon.id} marathonName={marathon.name} /> */}
      </div>
    </Link>
  );
}

export default memo(MarathonListCard);
