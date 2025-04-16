'use client';

import useMe from '@/hooks/useMe';

const NotificationSummary = () => {
  const { user } = useMe();
  const n = user?.notification;

  if (!user) return null;

  return (
    <div className={`p-4 rounded-lg border ${n?.isEnabled ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
      {n?.isEnabled ? (
        <>
          <p className="text-sm font-medium mb-2">📬 알림 설정 요약</p>
          <ul className="text-sm space-y-1">
            <li><strong>지역:</strong> {n.regions?.length ? n.regions.join(', ') : '전체 지역'}</li>
            <li><strong>종목:</strong> {n.events?.length ? n.events.join(', ') : '전체 종목'}</li>
          </ul>
        </>
      ) : (
        <p className="text-sm">🔕 현재 알림 기능이 꺼져 있습니다.</p>
      )}
    </div>
  );
};

export default NotificationSummary;
