import { useEffect } from 'react';
import clsx from 'clsx';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-2"
      onClick={(e) => {
        e.preventDefault();      // ✅ 링크 이동 방지
        onClose();
      }}
    >
      <div
        className="bg-white w-full h-full rounded-none sm:w-[400px] sm:h-auto sm:rounded-xl shadow-lg"
        onClick={(e) => {
          e.stopPropagation();  // ✅ 내부 클릭 이벤트 전파 방지
        }}
      >
        {children}
      </div>
    </div>
  );
}