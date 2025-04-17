'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useMe from '@/hooks/useMe';
import { signIn } from 'next-auth/react';


export const predefinedRegions : string[]  = ['서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종', '경북', '경남', '대구', '부산', '울산', '전북', '전남', '광주', '제주'];
export const predefinedEvents  : string[] = ['Full', 'Half', '10km', '5km'];

const NotificationSettings = () => {
  


  const { user, setNotification } = useMe();
  const [isEnabled, setIsEnabled] = useState(user?.notification?.isEnabled || false);
  const [regions, setRegions] = useState<string[]>(user?.notification?.regions || []);
  const [events, setEvents] = useState<string[]>(user?.notification?.events || []);
  const router = useRouter();


  useEffect(() => {
    if (user?.notification) {
      setIsEnabled(user.notification.isEnabled);
      setRegions(user.notification.regions || []);
      setEvents(user.notification.events || []);
    }
  }, [user]);


  if (!user) {
    signIn();
    return;
  }

  const toggleSelection = (item: string, setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelectedItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const handleSubmit = () => {
    setNotification({ isEnabled, regions, events });
    router.back();
  };

  return (
    <div className='p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-bold mb-4'>알림 설정</h2>
      <p>
        알림은 <strong>[지역]</strong>, <strong>[종목]</strong> 기준으로 설정 가능합니다.
        <br />
        설정되지 않은 항목은 전체로 판단합니다.
      </p>

      <div className='my-6'>
        <label className='cursor-pointer flex justify-between'>
          <h3 className='font-semibold mb-2'>알림 기능 사용</h3>
          <input type='checkbox' className='toggle toggle-primary' onChange={() => setIsEnabled((prev) => !prev)} checked={isEnabled} />
        </label>
        <h3 className='font-semibold mb-2'>지역</h3>
        <div className='flex flex-wrap gap-2'>
          {predefinedRegions.map((region) => (
            <button key={region} className={`btn ${regions.includes(region) ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}`} onClick={() => toggleSelection(region, setRegions)}>
              {region}
            </button>
          ))}
        </div>
        <div className='my-6'>
          <h3 className='font-semibold mb-2'>종목</h3>
          <div className='flex flex-wrap gap-2'>
            {predefinedEvents.map((event) => (
              <button key={event} className={`btn ${events.includes(event) ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}`} onClick={() => toggleSelection(event, setEvents)}>
                {event}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button className='btn btn-success w-full text-white' onClick={handleSubmit}>
        저장
      </button>
    </div>
  );
};

export default NotificationSettings;
