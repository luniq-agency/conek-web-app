"use client"

import { Ticket, TicketEntry } from '@/app/types/Database';
import styles from '../admin/Admin.module.css';
import { useEffect, useRef, useState } from 'react';
import { ticketEntriesLoadTicket, ticketEntryCreate } from '@/app/actions/tickets';
import { Button } from 'primereact/button';
import TicketUpdateBox from './TicketUpdateBox';
import { InputText } from 'primereact/inputtext';
import { useAuth } from '@/app/context/AuthContext';
import { OverlayPanel } from 'primereact/overlaypanel';

interface Props {
  ticket: Ticket;
}

export default function TicketPageClient({ ticket }: Props) {
    const op = useRef<OverlayPanel | null>(null);
  const { userProfile } = useAuth();

  const [entries, setEntries] = useState<TicketEntry[]>([]);

  // INPUTS
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!ticket) return;

    const fetchEntries = async () => {
      const res = await ticketEntriesLoadTicket(ticket.id);
      setEntries(res);
    };
    fetchEntries();
  }, [ticket]);

  // ACTIONS
  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !userProfile) return;

    const payload = {
      created_at: new Date(),
      created_by: userProfile.id,
      content: message,
      ticket: ticket.id,
    };

    try {
      await ticketEntryCreate(payload);
      setMessage('');
      const res = await ticketEntriesLoadTicket(ticket.id);
      setEntries(res ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.chatContainer} style={{flexGrow:1}}>
      <div className={styles.chatContainerHeader}>
        <div className="row">
          <h3>{ticket?.name}</h3>
        </div>
      </div>
      <div className={styles.chatContent}>
        {entries.map((entry) => (
          <TicketUpdateBox creator={entry.created_by} key={entry.id} entry={entry} />
        ))}
      </div>
      <form className={styles.chatContainerFooter} onSubmit={submitAnswer}>
        <InputText onChange={(e) => setMessage(e.target.value)} value={message} />
        <Button
          className="button-round"
          disabled={!message}
          icon="pi pi-send"
          onClick={submitAnswer}
          style={{ aspectRatio: 1, height: '100%' }}
          text
        />
      </form>
    </div>
  );
}
