import { Notification } from '@/app/types/Database';
import styles from './Notifications.module.css';
import { notificationUpdate } from '@/app/actions/notification';
import { useRef } from 'react';
import { ContextMenu } from 'primereact/contextmenu';

interface Props {
  notification: Notification;
}

export default function NotificationItem({ notification }: Props) {
  const menu = useRef<ContextMenu | null>(null);

  const items = [
    {
      label: 'Als gelesen markieren',
      command: () => markAsRead(),
    },
    {
      label: 'Löschen',
    },
  ];

  const markAsRead = async () => {
    const payload = {
      read: true,
    };
    try {
      await notificationUpdate(payload, notification.id);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div
      className={!notification.read ? `${styles.wrapper} ${styles.unread}` : styles.wrapper}
      onContextMenu={(e) => menu.current?.show(e)}
    >
      <ContextMenu model={items} ref={menu} breakpoint="767px" />
      <span className="width-100">{notification.message}</span>
      {!notification.read && <div className="dot-red" />}
    </div>
  );
}
