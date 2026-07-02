'use client';

import { TicketEntry } from '@/app/types/Database';
import styles from './Tickets.module.css';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '@/app/context/AuthContext';
import { formatDate, formatDateWithTime } from '@/app/utils/formats';
import DividerBlock from '../DividerBlock';

interface Props {
  creator: string;
  entry: TicketEntry;
}

export default function TicketUpdateBox({ creator, entry }: Props) {
  const { userProfile } = useAuth();
  const userIsSender = creator === userProfile?.id;

  return (
    <div className="row gap-s">
      <Avatar style={{ flexShrink:0, marginTop: 8 }} />
      <div
        className={styles.chatBubble}
        style={userIsSender ? { backgroundColor: '#efeefd' } : undefined}
      >
        <span className={styles.titleSmall}>Lukas</span>
        <span className={styles.textMeta}>{formatDateWithTime(entry.created_at)}</span>
        <DividerBlock height={1} />
        {entry.content}
      </div>
    </div>
  );
}
