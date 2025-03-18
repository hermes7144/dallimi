import { Marathon } from '@/model/marathon';
import dayjs from 'dayjs';
import { IoLocationSharp } from 'react-icons/io5';
import { FaRegCalendarAlt, FaWonSign } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { getMarathon } from '@/service/marathon';

interface Params {
  params: {
    id: string;
  };
}

export default async function MarathonDetailPage({ params: { id } }: Params) {
  const marathon = await getMarathon(id);

  console.log('marathon', marathon)
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* 🔥 배경 이미지 */}
      <div className="relative w-full h-64 sm:h-80">
        <Image src={marathon.image} alt={marathon.name} layout="fill" objectFit="cover" className="rounded-lg" />
      </div>

      {/* 📌 마라톤 정보 */}
      <h1 className="text-2xl font-bold mt-4">{marathon.name}</h1>
      <p className="text-gray-600">{marathon.region}, {marathon.location}</p>

      {/* 📅 일정 정보 */}
      <div className="mt-2 flex items-center gap-2 text-gray-700">
        <FaRegCalendarAlt />
        <span>{dayjs(marathon.date).format('YYYY년 M월 D일')}</span>
      </div>

      {/* 💰 가격 정보 */}
      <div className="mt-2 flex items-center gap-2 text-gray-700">
        <FaWonSign />
        <span>{marathon.price?.toLocaleString()}원 ~</span>
      </div>

      {/* 🏁 이벤트 정보 */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">참가 종목</h2>
        <ul className="list-disc pl-4">
        {marathon.events.map((event: string, index: number) => (
  <li key={index}>{event}</li>
))}
        </ul>
      </div>

      {/* 🔗 공식 사이트 */}
      <div className="mt-4">
        <a href={marathon.url} target="_blank" className="text-blue-500 hover:underline">
          공식 사이트 방문하기
        </a>
      </div>
    </div>
  );
}
