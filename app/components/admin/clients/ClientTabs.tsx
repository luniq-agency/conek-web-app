'use client';

import { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Client, Invoice, Task, User, UserUpdate } from '@/app/types/Database';
import ClientEditor, { ClientContactEditor } from './ClientEditor';
import DocumentViewer from '../documents/DocumentViewer';
import ClientHistory from './ClientHistory';
import InvoicesTable, { InvoicesTableUser } from '../invoices/InvoicesTable';
import CertificateTable from '../../CertificateTable';
import { userUpdatesLoad } from '@/app/actions/update';
import TasksGrid from '../../tasks/TaskGrid';

interface Props {
  user: User;
}

export default function ClientTabs({ user }: Props) {
  const [mounted, setMounted] = useState(false);

  // DATA
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [userUpdates, setUserUpdates] = useState<UserUpdate[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  const refreshData = async () => {
    try {
      const updateRes = await userUpdatesLoad(user.id);
      setUserUpdates(updateRes);
      console.log('Updates:', updateRes);
    } catch (err) {}
  };

  return (
    <TabView style={{ height: '100%' }}>
      <TabPanel header="Stammdaten">
        <ClientEditor user={user} />
      </TabPanel>
      <TabPanel header="Kontaktdaten">
        <ClientContactEditor user={user} />
      </TabPanel>
      <TabPanel header="Aufgaben">
        <TasksGrid user={user} />
      </TabPanel>
      <TabPanel header="Dokumente">
        <DocumentViewer user={user} />
      </TabPanel>
      <TabPanel header="Rechnungen">
        <InvoicesTableUser user={user} />
      </TabPanel>
    </TabView>
  );
}
