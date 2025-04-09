import { memo } from 'react';

type Props = {
  events: string[],
  maxVisibleCount?: number;
};

const priorityMap: Record<string, number> = {
  Full: 1,
  Half: 2,
  '10km': 3,
  '5km': 4,
};

const colorMap: Record<string, string> = {
  Full: 'bg-red-400',
  Half: 'bg-orange-400'
};

function EventList({ events, maxVisibleCount = 4 }: Props) {
  const sortedEvents = [...events].sort((a, b) => {
    const aPriority = priorityMap[a] ?? 999;
    const bPriority = priorityMap[b] ?? 999;
    return aPriority - bPriority;
  });

  const visibleEvents = sortedEvents.slice(0, maxVisibleCount);
  const hiddenEvents = sortedEvents.length > maxVisibleCount ? sortedEvents.slice(maxVisibleCount) : [];

  return (
    <div className="flex gap-2">
      {visibleEvents.map((event) => {
        const bgColor = colorMap[event] ?? 'bg-primary';
        return (
          <div
            key={event}
            className={`inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full max-w-20 ${bgColor}`}>
            <span className="truncate">{event}</span>
          </div>
        );
      })}
      {hiddenEvents.length > 0 && <span>...</span>}
    </div>
  );
}

export default memo(EventList);
