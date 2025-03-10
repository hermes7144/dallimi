'use client'

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    const handleSetting = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className='relative'>
            <div tabIndex={0} role='button' className='avatar' onClick={() => setIsOpen(!isOpen)}>
                <div className='w-8 h-8 rounded-full'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {user && user.image && <img src={user.image} alt={user.username} referrerPolicy='no-referrer' />}
                </div>
            </div>

            {isOpen && (
                <div className='absolute right-0 mt-2'>
                    <ul className='dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-lg z-10'>
                        <li>
                        <Link href='/setting' onClick={handleSetting}>
                              설정
                            </Link>
                        </li>
                        <li>
                            <a onClick={handleLogout}>로그아웃</a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
