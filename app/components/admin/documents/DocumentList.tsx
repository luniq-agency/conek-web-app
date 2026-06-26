'use client';

import { Client, Document, User } from '@/app/types/Database';
import { client_status, job_categories } from '@/app/constants/Constants';
import { FilterMatchMode } from 'primereact/api';
import { formatDate } from '@/app/utils/formats';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Dropdown } from 'primereact/dropdown';
import { UserAvatarOther } from '../../UserAvatar';
import { documentsLoadAll } from '@/app/actions/documents';
import { usersLoadAll } from '@/app/actions/users';
import { Sidebar } from 'primereact/sidebar';
import DocumentEditor from './DocumentEditor';
import { Dialog } from 'primereact/dialog';

export default function DocumentList() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const toast = useRef<Toast | null>(null);

  const [mounted, setMounted] = useState(false);

  //DATA
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (mounted) return;
    const fetchData = async () => {
      try {
        const docuRes = await documentsLoadAll();
        const userRes = await usersLoadAll();
        setDocuments(docuRes);
        setUsers(userRes);
        setMounted(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [mounted]);

  //FILTER
  const [filters, setFilters] = useState<{
    global: { value: string | null; matchMode: FilterMatchMode };
    berufsstatus: { value: string | null; matchMode: FilterMatchMode };
    status: { value: string | null; matchMode: FilterMatchMode };
  }>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    berufsstatus: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, global: { ...prev.global, value } }));
    setGlobalFilterValue(value);
  };

  //ACTIONS
  const refreshList = async () => {
    try {
      const docuRes = await documentsLoadAll();
      setDocuments(docuRes);
    } catch (err) {
      console.error(err);
    }
  };

  //TEMPLATES
  const nameTemplate = (rowData: Document) => {
    if (!users) return;
    const profile = users.find((t) => t.id === rowData.user);

    return (
      <div className="row gap-s align-center">
        <span>
          {profile?.user_name_last || ''}, {profile?.user_name_first || ''}
        </span>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        draggable={false}
        header="Dokument bearbeiten"
        onHide={() => setVisible(false)}
        style={{ height: '80vh', maxWidth: '70vw', width: '100%' }}
        visible={visible}
      >
        {selectedDocument && (
          <DocumentEditor document={selectedDocument} onSave={refreshList} users={users} />
        )}
      </Dialog>
      <DataTable
        emptyMessage="Keine Dokumente gefunden."
        filterDisplay="menu"
        filters={filters}
        globalFilterFields={['vorname', 'nachname']}
        paginator
        onRowClick={(e) => {
          setVisible(true);
          setSelectedDocument(e.data as Document);
        }}
        rows={10}
        sortField="document_name"
        sortOrder={1}
        stripedRows
        value={documents}
      >
        <Column field="document_name" header="Name" sortable />
        <Column body={nameTemplate} header="Kunde" />
      </DataTable>
    </>
  );
}
