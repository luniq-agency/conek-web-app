'use client';

import { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Certificate, Client, Invoice, Task, User, UserUpdate } from '@/app/types/Database';
import ClientEditor, { ClientContactEditor } from '../admin/clients/ClientEditor';
import DocumentViewer from '../documents/DocumentViewer';
import InvoicesTable, { InvoicesTableUser } from '../admin/invoices/InvoicesTable';
import { userUpdatesLoad } from '@/app/actions/update';
import TasksGrid from '../tasks/TaskGrid';
import CertificateFile from '../documents/CertificateFile';
import { certificatesLoadUser } from '@/app/actions/certificates';
import { Button } from 'primereact/button';
import DividerBlock from '../DividerBlock';
import { adminsLoadAll } from '@/app/actions/admin';

interface Props {
  user: User;
}

export default function ClientTabs({ user }: Props) {
  const [mounted, setMounted] = useState(false);

  // DATA
  const [admins, setAdmins] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [userUpdates, setUserUpdates] = useState<UserUpdate[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await certificatesLoadUser(user.id);
        setCertificates(res);
        const adminRes = await adminsLoadAll();
        setAdmins(adminRes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    setMounted(true);
  }, [user]);

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
        <TasksGrid admins={admins} user={user} />
      </TabPanel>
      <TabPanel header="Zertifikatsdatei">
        <div className="column width-100">
          <div className="row space-between width-100">
            <h3>Zertifikatsdateien</h3>
            <Button icon="pi pi-upload" label="Zertifikatsdatei hochladen" />
          </div>
          <DividerBlock height={2} />
          <div className="grid columns-four gap-m">
            {certificates.map((c, i) => (
              <CertificateFile certificate={c} key={i} />
            ))}
          </div>
        </div>
      </TabPanel>
      <TabPanel header="Dokumente">
        <h3>Dokumente</h3>
        <DocumentViewer user={user} />
      </TabPanel>
      <TabPanel header="Rechnungen">
        <InvoicesTableUser user={user} />
      </TabPanel>
    </TabView>
  );
}
