import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');
import { FaExternalLinkAlt, FaRegCalendarAlt, FaWonSign } from 'react-icons/fa';
import Image from 'next/image';
import { getMarathon, getMarathons } from '@/service/marathon';
import { Metadata } from 'next';
import EventList from '@/components/EventList';

interface Props {
  params: {
    id: string;
  };
}

const defaultImage = '/default-marathon.jpg';

export default async function MarathonDetailPage({ params: { id } }: Props) {
  const marathon = await getMarathon(id);

  const dayNumber = dayjs(marathon.date).day(); // 0: 일, 6: 토
  const dateText = dayjs(marathon.date).format('YYYY년 M월 D일'); // 0: 일, 6: 토
  const dayText = dayjs(marathon.date).format('ddd');

  let textColor = '';
  if (dayNumber === 0) {
    textColor = 'text-red-500'; // 일요일
  } else if (dayNumber === 6) {
    textColor = 'text-blue-500'; // 토요일
  }

  return (
      <div className='w-full flex justify-center px-4'>
        <div className='w-full max-w-3xl pt-8'>
          <div className='relative w-full h-64 sm:h-80'>
            <Image src={marathon.image || defaultImage} alt={marathon.name} layout='fill' className='rounded-lg object-cover' />
          </div>
          <div className='flex justify-between items-center mt-4'>
            <h1 className='text-2xl font-bold'>{marathon.name}</h1>
            <a href={marathon.url} target='_blank' className='text-blue-500 hover:text-blue-700 transition duration-200'>
              <FaExternalLinkAlt size={20} />
            </a>
          </div>
          <p className='text-gray-600'>
            {marathon.region}, {marathon.location}
          </p>
    
          <div className='mt-2 text-gray-700'>
            <div className='flex items-center gap-2'>
              <FaRegCalendarAlt />
              <span>
                접수 기간: {dayjs(marathon.startDate).format('YYYY년 M월 D일')} ~{' '}
                {marathon.endDate && dayjs(marathon.endDate).format('YYYY년 M월 D일')}
              </span>
            </div>
            <div className='flex items-center text-gray-600'>
              <FaRegCalendarAlt className='w-5 h-5 flex-shrink-0 mr-1' />
              <span>{dateText}</span>
              <span className={`${textColor} ml-1`}>({dayText})</span>
            </div>
          </div>
          <div className='mt-2 flex items-center gap-2 text-gray-700'>
            <FaWonSign />
            <span>{marathon.price?.toLocaleString()}원 ~</span>
          </div>
    
          <div className='mt-4'>
            <EventList events={marathon.events} />
          </div>
        </div>
      </div>
    );
  
}

export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
  const marathon = await getMarathon(id);

  return {
    title: `${marathon?.name} • 러닝알리미`,
    description: `${marathon?.name} 대회는 ${dayjs(marathon.date).format('YYYY년 M월 D일')}에 열리며, 참가 신청은 ${dayjs(marathon.startDate).format('YYYY년 M월 D일')}부터 ${dayjs(
      marathon.endDate
    ).format('YYYY년 M월 D일')}까지 가능합니다.`,
    keywords: '러닝, 마라톤, 대회 일정, 알림, 트레이닝, 기록 관리, 러닝알리미',
  };
}


export const dynamic = 'force-static';

export async function generateStaticParams() {
  const marathons = await getMarathons();
  return marathons.map((marathon) => ({ id: marathon.id}));
}