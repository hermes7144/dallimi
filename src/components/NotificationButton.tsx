import { LuBellPlus, LuBellRing } from "react-icons/lu";
import { useState, useEffect } from 'react';
import ToggleButton from './ui/ToggleButton';
import useMe from '@/hooks/useMe';
import { Marathon } from '@/model/marathon';
import useMarathons from '@/hooks/useMarathons';
// import { subscribeNotification, unsubscribeNotification } from '../api/database';
// import { useToastStore } from '../store/toastStore';
// import useAuthStore from '../store/authStore';

type props = {
  marathon: Marathon;
};

const NotificationButton = ({ marathon }: props) => {
  const { id, participants } = marathon;
  const { user } = useMe();
  const { setNotify } = useMarathons();

  const notified = user ? participants.includes(user.id) : false;

  const handleNotify = (notify: boolean) => {
    user && setNotify(marathon, id, notify);
  };

  return (
<button
  type="button"
  onClick={handleNotify}
  className="flex items-center justify-center p-3 md:hover:bg-gray-300 rounded-full absolute top-2 right-2">
  <ToggleButton title={notified ? 'unlike': 'like'} toggled={notified} onToggle={handleNotify} onIcon={<LuBellRing />} offIcon={<LuBellPlus />} />

</button>
  );
};

export default NotificationButton;
