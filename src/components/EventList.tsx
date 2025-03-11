import { memo } from 'react';

type Props = {
  events: string[],
  maxVisibleCount?: number;
}

function EventList({ events, maxVisibleCount = 4 } : Props) {

  const visibleEvents = events.slice(0, maxVisibleCount);
  const hiddenEvents = events.length > maxVisibleCount ? events.slice(maxVisibleCount) : [];

  return (
    <div className='flex gap-2'>
      {visibleEvents.map((event) => (
        <div
          key={event}
          className={`inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full max-w-20 ${event === 'Full' ? 'bg-red-400' : event === 'Half' ? 'bg-orange-400' : 'bg-primary'}`}>
          <span className='truncate'>{event}</span>
        </div>
      ))}

      {hiddenEvents.length > 0 && <span>...</span>}
    </div>
  );
}

export default memo(EventList);
