'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from './ui/icons/HomeIcon';
import MarathonIcon from './ui/icons/MarathonIcon';
import SearchIcon from './ui/icons/SearchIcon';
import SettingIcon from './ui/icons/SettingIcon';

const menu = [
  { href: '/', label: '홈', icon: <HomeIcon /> },
  { href: '/marathon', label: '마라톤', icon: <MarathonIcon /> },
  { href: '/search', label: '검색', icon: <SearchIcon /> },
  { href: '/setting', label: '설정', icon: <SettingIcon /> },
];

export default function DockMenu() {
  const pathname = usePathname();

  return (
    <div className='dock dock-xs md:hidden'>
      {menu.map(({ href, label, icon }) => {
        const isActive = pathname === href;

        return (
          <Link key={href} href={href}>
            <button
              className={` ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-black'
              }`}
            >
              {icon}
              {/* <span className='dock-label'>{label}</span> */}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
