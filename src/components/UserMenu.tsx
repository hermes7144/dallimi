'use client'

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  // 화면 크기에 따라 모바일 여부 판단
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      router.push('/account'); // 모바일에서는 별도 페이지로 이동
    } else {
      setIsOpen(!isOpen); // PC는 드롭다운 토글
    }
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className='relative'>
      <div tabIndex={0} role='button' className='avatar' onClick={handleClick}>
        <div className='w-8 h-8 rounded-full'>
          {user?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.username} referrerPolicy='no-referrer' />
          )}
        </div>
      </div>

      {!isMobile && isOpen && (
        <div className='absolute right-0 mt-2'>
          <ul className='dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-lg z-10'>
            <li>
              <Link href='/setting' onClick={() => setIsOpen(false)}>
                설정
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>로그아웃</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
