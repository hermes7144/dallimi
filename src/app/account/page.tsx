'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (!session) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">로그인이 필요합니다.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          홈으로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={session.user?.image || ''} alt="User" className="w-12 h-12 rounded-full" />
        <div>
          <p className="text-lg font-semibold">{session.user?.name}</p>
          <p className="text-sm text-gray-500">{session.user?.email}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 rounded shadow"
      >
        로그아웃
      </button>
    </div>
  );
}
