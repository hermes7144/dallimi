import dayjs from 'dayjs';
import { MarathonProps } from '../types/MarathonProps';

export const MarathonBadge = ({ marathon }: { marathon: MarathonProps }) => {
  const today = dayjs();

  let status = '';

  if (today.isBefore(marathon.startDate)) {
    status = '모집예정';
  } else if (today.isAfter(marathon.endDate)) {
    status = '모집종료';
  } else if (marathon.isClosed) {
    status = '모집마감';
  } else {
    status = '모집중';
  }

  const statusStyles: Record<string, string> = {
    모집예정: 'bg-yellow-500 text-white',
    모집중: 'bg-green-500 text-white',
    모집종료: 'bg-gray-400 text-white',
  };
  return (
    <div className='block m-1 sm:absolute top-2 left-2'>
      <span className={`px-2 sm:px-4 py-1 rounded-full text-xs sm:text-md font-bold shadow-md ${statusStyles[status] || 'bg-red-500 text-white'}`}>{status}</span>
    </div>
  );
};
