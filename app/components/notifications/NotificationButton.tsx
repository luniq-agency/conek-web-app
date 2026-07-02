'use client';

import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useEffect, useRef, useState } from 'react';
import { Notification, User } from '../../types/Database';
import { notificationsLoadUser, notificationsMarkAllRead } from '../../actions/notification';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import NotificationItem from './NotificationItem';

interface Props {
  user: User;
}

export default function NotificationButton({ user }: Props) {
  const op = useRef<OverlayPanel | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        const res = await notificationsLoadUser(user.id);
        setNotifications(res);
      } catch (err) {
        console.error(err);
      }
    };
    loadNotifications();
  }, [user]);

  const markasread = async () => {
    await notificationsMarkAllRead(user.user_uuid);
  };

  const reloadNotifications = async () => {
    const res = await notificationsLoadUser(user.id);
    setNotifications(res);
  };

  return (
    <>
      <OverlayPanel ref={op} style={{ maxWidth: 360, width: '100%' }}>
        <div className="context-menu-header">
          <span className="text-s" style={{ fontWeight: 600 }}>
            Benachrichtigungen
          </span>
          <Button
            className="container-link"
            disabled={notifications.length === 0}
            label="Als gelesen markieren"
            onClick={markasread}
            style={{ backgroundColor: 'transparent', padding: 0 }}
          />
        </div>
        {notifications.length >= 1 ? (
          <DataScroller
            itemTemplate={(item) => <NotificationItem notification={item} onClick={reloadNotifications}/>}
            rows={5}
            value={notifications}
          />
        ) : (
          <div style={{ padding: 16 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Du hast keine ungelesenen Benachrichtigungen.
            </span>
          </div>
        )}
      </OverlayPanel>
      <i
        className="pi pi-bell p-overlay-badge"
        style={{ cursor: 'pointer', fontSize: '1.25rem' }}
        onClick={(e) => op.current?.toggle(e)}
      >
        {notifications.length >= 1 && <Badge value={notifications.length}></Badge>}
      </i>
    </>
  );
}
