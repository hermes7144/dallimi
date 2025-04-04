import { Marathon } from '@/model/marathon';
import dayjs from 'dayjs';
import clsx from 'clsx';

export const MarathonBadge = ({ marathon, position = 'static' }: { marathon: Marathon, position?: string }) => {
  const today = dayjs();

  const getStatus = () => {
    if (dayjs(marathon.startDate).isAfter(today)) return '모집예정';
    if (dayjs(marathon.endDate).isBefore(today)) return '모집종료';
    if (marathon.isClosed) return '모집마감';
    return '모집중';
  };

  const status = getStatus();

  const statusStyles: Record<string, string> = {
    모집예정: 'bg-yellow-500 text-white',
    모집중: 'bg-green-500 text-white',
    모집종료: 'bg-gray-400 text-white',
    모집마감: 'bg-red-500 text-white',
  };

  return (
    <div
      className={clsx(
        'm-1 top-2 left-2',
        position === 'absolute' && 'absolute hidden sm:block',
        position === 'static' && 'block sm:hidden'
      )}
    >
      <span
        className={clsx(
          'px-2 sm:px-4 py-1 rounded-full text-xs sm:text-md font-bold shadow-md',
          statusStyles[status]
        )}
      >
        {status}
      </span>
    </div>
  );
};
