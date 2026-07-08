'use client';

import ClientTable from '../../clients/ClientTable';
import DividerBlock from '../../DividerBlock';
import AdminClientCreate from '../../clients/AdminClientCreate';
import SearchBox from '../../forms/SearchBox';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { User } from '@/app/types/Database';
import { clientsLoadAll } from '@/app/actions/clients';

export default function Clients() {
  const { userProfile } = useAuth();
  const [searchName, setSearchName] = useState('');

  const [clients, setClients] = useState<User[]>([]);

  useEffect(() => {
    if (!userProfile) return;
    const fetchClients = async () => {
      const clientRes = await clientsLoadAll(userProfile.user_role, userProfile.id);
      setClients(clientRes);
    };
    fetchClients();
  }, [userProfile]);

  return (
    <div className="page-content" style={{ height: '100%' }}>
      <div className="row align-center space-between">
        <h1>Kunden</h1>
        <SearchBox
          maxWidth={480}
          onChange={setSearchName}
          placeholder="Suchen"
          value={searchName}
        />
        <AdminClientCreate />
      </div>
      <DividerBlock height={2} />
      <div className="container" style={{ maxHeight: '100%' }}>
        <ClientTable clients={clients} search={searchName} />
      </div>
    </div>
  );
}
