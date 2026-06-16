'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../admin/Admin.module.css';
import { DataScroller } from 'primereact/datascroller';
import { Ticket, TicketEntry } from '@/app/types/Database';
import TicketBox from './TicketBox';
import { InputText } from 'primereact/inputtext';
import DividerBlock from '../DividerBlock';
import { ticketEntriesLoadTicket, ticketEntryCreate } from '@/app/actions/tickets';
import { Button } from 'primereact/button';
import TicketUpdateBox from './TicketUpdateBox';
import { useAuth } from '@/app/context/AuthContext';
import { OverlayPanel } from 'primereact/overlaypanel';

interface Props {
  tickets: Ticket[];
}
export default function TicketsAdmin({ tickets }: Props) {
  const { user, userProfile } = useAuth();

  const op = useRef<OverlayPanel | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // TICKET & ENTRIES
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [entries, setEntries] = useState<TicketEntry[]>([]);

  //SUCHFUNKTION
  const [search, setSearch] = useState('');
  const filtered = tickets.filter((t) => t.name?.toLowerCase().includes(search.toLowerCase()));

  //CHAT
  const [message, setMessage] = useState('');

  //LOAD ENTRIES
  useEffect(() => {
    if (!selectedTicket) return;

    const fetchEntries = async () => {
      const res = await ticketEntriesLoadTicket(selectedTicket.id);
      setEntries(res ?? []);
    };

    fetchEntries();
  }, [selectedTicket]);

  //SCROLL TO BOTTOM
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const submitAnswer = async () => {
    if (!selectedTicket || !userProfile) return;

    const payload = {
      created_at: new Date(),
      created_by: userProfile.id,
      content: message,
      ticket: selectedTicket.id,
    };

    try {
      await ticketEntryCreate(payload);
      setMessage('');
      const res = await ticketEntriesLoadTicket(selectedTicket.id);
      setEntries(res ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="row width-100">
      <OverlayPanel ref={op}>
        <div className="column">
          <Button className="button-context" label="Ticket übertragen" />
          <Button className="button-context" label="Ticket schließen" />
        </div>
      </OverlayPanel>
      <div className={styles.adminContainer}>
        <h3>Tickets</h3>
        <DividerBlock height={1} />
        <div className="row gap-s">
          <InputText
            disabled={tickets.length === 0}
            placeholder="Suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/*<Button
            className="button-square button-bordered"
            disabled={tickets.length === 0}
            icon="pi pi-filter"
          />
          */}
        </div>
        <DividerBlock height={1} />
        <DataScroller
          buffer={0.4}
          emptyMessage="Keine Tickets gefunden"
          itemTemplate={(item) => (
            <TicketBox
              onClick={() => setSelectedTicket(item)}
              selected={item === selectedTicket}
              ticket={item}
            />
          )}
          rows={10}
          value={filtered}
        />
      </div>
      {selectedTicket && (
        <div className={styles.chatContainer}>
          <div className={styles.chatContainerHeader}>
            <div className="row space-between">
              <h3>{selectedTicket?.name}</h3>
              <Button
                className="button-square button-bordered"
                icon="pi pi-ellipsis-v"
                onClick={(e) => op.current?.toggle(e)}
              />
            </div>
          </div>
          <div className={styles.chatContent}>
            {entries.map((entry) => (
              <TicketUpdateBox creator={entry.created_by} key={entry.id} entry={entry} />
            ))}
          </div>
          <div className={styles.chatContainerFooter}>
            <InputText onChange={(e) => setMessage(e.target.value)} value={message} />
            <Button
              className="button-round"
              disabled={!message}
              icon="pi pi-send"
              onClick={submitAnswer}
              style={{ aspectRatio: 1, height: '100%' }}
              text
            />
          </div>
        </div>
      )}
    </div>
  );
}
