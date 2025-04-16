import { memo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

import { MarathonBadge } from './MarathonBadge';
import { FaRegCalendarAlt, FaWonSign } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { Marathon } from '@/model/marathon';
import Link from 'next/link';
import EventList from './EventList';
import useMe from '@/hooks/useMe';
import useMarathons from '@/hooks/useMarathons';
import ToggleButton from './ui/ToggleButton';
import { LuBellPlus, LuBellRing } from 'react-icons/lu';
import Image from 'next/image';
import ModalPortal from './ui/ModalPortal';
import Modal from './Modal';
import { signIn } from 'next-auth/react';

const MemoizedFaRegCalendarAlt = memo(FaRegCalendarAlt);
const MemoizedIoLocationSharp = memo(IoLocationSharp);
const MemoizedFaWonSign = memo(FaWonSign);

type Props = {
  marathon: Marathon;
  priority: boolean;
};

function MarathonListCard({ marathon, priority = false }: Props) {
  const { id, name, region, location, date, price, image, events, url, participants } = marathon;
  const [openModal, setOpenModal] = useState(false);

  const { user } = useMe();

  const { setNotify } = useMarathons();
  const notified = user ? participants?.includes(user.id) : false;

  const handleNotify = (notify: boolean) => {
    if (!user) {
      setOpenModal(true);
      return;
    }

    user && setNotify(marathon, user.id, notify);
  };

  const dayNumber = dayjs(date).day();
  const dateText = dayjs(date).format('YYYY년 M월 D일');
  const dayText = dayjs(date).format('ddd');

  let textColor = '';
  if (dayNumber === 0) {
    textColor = 'text-red-500'; // 일요일
  } else if (dayNumber === 6) {
    textColor = 'text-blue-500'; // 토요일
  }

  return (
      <Link href={`/marathon/${id}`} className='block border border-gray-300 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer relative'>
        <Image src={image ?? ''} alt={`${name} 이미지`} width={300} height={200} className='hidden lg:block w-full aspect-[16/9] border-b border-b-gray-100 rounded-t-lg' />
        <MarathonBadge position={'absolute'} marathon={marathon} />
        <div className='w-full flex flex-col p-2 sm:p-4 gap-1 text-sm sm:text-lg relative'>
          <div className='flex justify-between items-center gap-4'>
            <div className='flex items-center'>
              <MarathonBadge marathon={marathon} />
              <h2 className='max-w-60 font-semibold text-gray-800 truncate'>{name}</h2>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex items-center text-gray-600'>
              <MemoizedFaRegCalendarAlt className='w-5 h-5 flex-shrink-0  mr-1' />
              <span>{dateText}</span>
              <span className={textColor + ' ml-1'}>({dayText})</span>
            </div>
            <ToggleButton
              title={notified ? 'notify' : 'unnotify'}
              toggled={notified}
              onToggle={(toggled, e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNotify(toggled);
              }}
              onIcon={<LuBellRing className='w-6 h-6' />}
              offIcon={<LuBellPlus className='w-6 h-6' />}
            />
            {openModal && <ModalPortal>
              <Modal open={openModal} onClose={() => setOpenModal(false)}>

              <div className="p-6">
          <h2 className="text-lg font-semibold">로그인이 필요해요</h2>
          <p className="mt-2 text-sm text-gray-600">알림을 사용하려면 로그인이 필요합니다.</p>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setOpenModal(false);
                signIn();
              }}
            >
              로그인 하기
            </button>
          </div>
        </div> 

              </Modal>
            </ModalPortal>}
          </div>
          <div className='flex items-center text-gray-600'>
            <MemoizedIoLocationSharp className='w-5 h-5 flex-shrink-0 mr-1' />
            <span className='truncate w-44 sm:w-full'>
              {region}, {location}
            </span>
          </div>
          <div className='flex items-center text-gray-600'>
            <MemoizedFaWonSign className='w-5 h-5 flex-shrink-0 mr-1' />
            {price.toLocaleString()}원 ~
          </div>
          <EventList events={events} />
        </div>
      </Link>
  );
}

export default memo(MarathonListCard);
