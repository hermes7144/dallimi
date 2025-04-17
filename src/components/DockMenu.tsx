'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HomeIcon from './ui/icons/HomeIcon';
import MarathonIcon from './ui/icons/MarathonIcon';
import SearchIcon from './ui/icons/SearchIcon';
import SettingIcon from './ui/icons/SettingIcon';

export default function DockMenu() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menu = [
    { href: '/', label: '홈', icon: <HomeIcon /> },
    { href: '/marathon', label: '마라톤', icon: <MarathonIcon /> },
    { href: '/search', label: '검색', icon: <SearchIcon /> },
    {
      href: session ? '/setting' : '/auth/signin', // ✅ 로그인 여부에 따라 링크 변경
      label: '설정',
      icon: <SettingIcon />,
    },
  ];

  return (
    <div className='dock dock-xs md:hidden'>
      {menu.map(({ href, label, icon }) => {
        const isActive = pathname === href || (label === '설정' && pathname === '/setting');

        return (
          <Link key={label} href={href}>
            <button
              className={`${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-black'
              }`}
            >
              {icon}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
