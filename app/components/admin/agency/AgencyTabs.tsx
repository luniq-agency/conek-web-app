'use client';

import { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import ClientTable from '@/app/components/clients/ClientTable';
import { Client, User } from '@/app/types/Database';
import AgencyEditor from '../../agency/AgencyEditor';

interface Props {
  agent: User;
}
export default function AgencyTabs({ agent }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <TabView>
      <TabPanel header="Kunden">
        <ClientTable bearbeiter={agent} />
      </TabPanel>
      <TabPanel header="Profil">
        <AgencyEditor user={agent} />
      </TabPanel>
      <TabPanel header="Statistiken"></TabPanel>
    </TabView>
  );
}
