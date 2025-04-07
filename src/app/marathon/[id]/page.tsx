import { Marathon } from '@/model/marathon';
import dayjs from 'dayjs';
import { IoLocationSharp } from 'react-icons/io5';
import { FaExternalLinkAlt, FaRegCalendarAlt, FaWonSign } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { getMarathon } from '@/service/marathon';
import { Metadata } from 'next';
import EventList from '@/components/EventList';

interface Props {
  params: {
    id: string;
  };
}

export default async function MarathonDetailPage({ params: { id } }: Props) {
  const marathon = await getMarathon(id);

  return (
    <div className='max-w-3xl mx-auto p-4'>
      <div className='relative w-full h-64 sm:h-80'>
        <Image src={marathon.image} alt={marathon.name} layout='fill' className='rounded-lg' />
      </div>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold mt-4'>{marathon.name}</h1>
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
            접수 기간: {dayjs(marathon.startDate).format('YYYY년 M월 D일')} ~ {marathon.endDate && dayjs(marathon.endDate).format('YYYY년 M월 D일')}
          </span>
        </div>
        <div className='flex items-center gap-2 mt-1'>
          <FaRegCalendarAlt />
          <span>대회 일정: {dayjs(marathon.date).format('YYYY년 M월 D일')}</span>
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
  );
}

export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
  const marathon = await getMarathon(id);

  return {
    title: `${marathon?.name} • 러닝알리미`,
    description: `${marathon?.name} 대회는 ${dayjs(marathon.date).format('YYYY년 M월 D일')}에 열리며, 참가 신청은 ${dayjs(marathon.startDate).format('YYYY년 M월 D일')}부터 ${dayjs(
      marathon.endDate
    ).format('YYYY년 M월 D일')}까지 가능합니다.`,
  };
}
