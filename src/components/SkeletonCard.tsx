export default function SkeletonCard() {
  return (
    <div className="animate-pulse block border border-gray-300 bg-white rounded-lg shadow-lg relative min-w-[260px] sm:min-w-[280px] max-w-sm w-full">
      {/* PC에서 보이는 썸네일 */}
      <div className="hidden lg:block w-full aspect-[16/9] bg-gray-200 rounded-t-lg" />

      <div className="p-2 sm:p-4 space-y-3">
        <div className="h-5 bg-gray-300 rounded w-1/2" /> {/* 제목 */}
        <div className="h-4 bg-gray-300 rounded w-3/4" /> {/* 날짜 */}
        <div className="h-4 bg-gray-300 rounded w-2/3" /> {/* 지역 */}
        <div className="h-4 bg-gray-300 rounded w-1/3" /> {/* 가격 */}
        <div className="h-6 bg-gray-300 rounded w-full" /> {/* 이벤트 */}
      </div>
    </div>
  );
}