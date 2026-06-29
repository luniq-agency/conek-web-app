'use client';

import { User } from '@/app/types/Database';
import { client_status, job_categories } from '@/app/constants/Constants';
import { FilterMatchMode } from 'primereact/api';
import { formatDate } from '@/app/utils/formats';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Dropdown } from 'primereact/dropdown';
import { UserAvatarOther } from '@/app/components/UserAvatar';
import { clientsLoadAgency, clientsLoadAll, clientUpdate } from '@/app/actions/clients';
import { Dialog } from 'primereact/dialog';
import { agencyLoadAll } from '@/app/actions/agency';
import { userUpdate } from '@/app/actions/users';

interface Props {
  bearbeiter?: User;
}

export default function ClientTable({ bearbeiter }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const toast = useRef<Toast | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1025);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  //
  const [agents, setAgents] = useState<User[]>([]);
  const [transferring, setTransferring] = useState(false);
  const [transferTarget, setTransferTarget] = useState<User | null>(null);

  // ZEILENHÖHE
  const [rows, setRows] = useState(7);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const calculateRows = () => {
      const rowHeight = 73;
      const offsetTop = tableRef.current?.getBoundingClientRect().top ?? 200;
      const paginatorHeight = 53.56;
      const tableHeaderHeight = 56.5;
      const available = window.innerHeight - offsetTop - paginatorHeight - tableHeaderHeight;
      setRows(Math.max(1, Math.floor(available / rowHeight)));
    };

    calculateRows();
    window.addEventListener('resize', calculateRows);
    return () => window.removeEventListener('resize', calculateRows);
  }, []);

  //DATA
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClients, setSelectedClients] = useState<User[]>([]);

  const [rowClick, setRowClick] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (bearbeiter)
        try {
          const clientRes = await clientsLoadAgency(bearbeiter.id);
          setClients(clientRes);
        } catch (err) {
          console.error(err);
        }
      if (!bearbeiter)
        try {
          const clientRes = await clientsLoadAll();
          setClients(clientRes);
          const agencyRes = await agencyLoadAll();
          setAgents(agencyRes);
        } catch (err) {}
    };

    fetchData();
  }, []);

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

  //SELECTION
  const selectClient = (rowData: User) => {
    router.push(`/admin/kunden/${rowData.id}`);
  };

  const show = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Profil aktualisiert',
      detail: 'Das Profil des Kunden wurde aktualisiert.',
    });
  };

  //TEMPLATES
  const actionTemplate = (rowData: User) => {
    return (
      <div className="row gap-xs">
        <Button
          className="button-square"
          icon="pi pi-pencil"
          onClick={(e) => selectClient(rowData as User)}
        />
      </div>
    );
  };

  const categoryTemplates = (rowData: User) => {
    const statusObj = job_categories.find((t) => t.value === rowData.job_status);
    return (
      <Tag
        style={{ backgroundColor: statusObj?.bg, color: statusObj?.color }}
        value={statusObj?.label ?? ''}
      />
    );
  };

  const certificateTemplate = (rowData: User) => {
    return <span>{rowData.certificate ? '✅' : '❌'}</span>;
  };

  const nameTemplate = (rowData: User) => {
    const job = job_categories.find((t) => t.value === rowData.job_status);

    return (
      <div className="row gap-s align-center">
        <UserAvatarOther
          backgroundColor={job?.bg}
          color={job?.color}
          fontSize={11}
          height={30}
          user={rowData}
          width={30}
        />
        <span>
          {rowData.user_name_last}, {rowData.user_name_first}
        </span>
      </div>
    );
  };

  const statusTemplate = (rowData: User) => {
    if (!rowData.status) return;

    const statusObj = client_status.find((t) => t.value === rowData.status);
    return (
      <Tag
        style={{ backgroundColor: statusObj?.bg, color: statusObj?.color }}
        value={statusObj?.label ?? ''}
      />
    );
  };

  const transferClients = async () => {
    if (!transferTarget) return;

    try {
      await Promise.all(
        selectedClients.map((client) => {
          clientUpdate({ bearbeiter: transferTarget.id }, client.client_profile);
          userUpdate({ bearbeiter: transferTarget.id }, client.id);
        })
      );
      setTransferring(false);
      setSelectedClients([]);
      setTransferTarget(null);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setTransferring(false);
      setTransferTarget(null);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Kunden zuweisen"
        onHide={() => setTransferring(false)}
        style={{ maxWidth: 400, width: '100%' }}
        visible={transferring}
      >
        <div className="column gap-m">
          <div className="column gap-xs">
            <label>Bearbeiter</label>
            <Dropdown
              filter
              filterPlaceholder="Suchen"
              onChange={(e) => setTransferTarget(e.value)}
              optionLabel="fullName"
              options={agents.map((a) => ({
                ...a,
                fullName: `${a.user_name_last}, ${a.user_name_first}`,
              }))}
              value={transferTarget}
            />
          </div>
          <Button
            disabled={!transferTarget || selectedClients.length === 0}
            label="Kunden zuweisen"
            onClick={transferClients}
          />
        </div>
      </Dialog>
      <div ref={tableRef}>
        {selectedClients.length >= 1 && bearbeiter && (
          <Button label="Kunden zuweisen" onClick={() => setTransferring(true)} />
        )}
        <DataTable
          emptyMessage="Keine Kunden gefunden."
          filterDisplay="menu"
          filters={filters}
          globalFilterFields={['user_name_first', 'user_name_last']}
          paginator
          onSelectionChange={(e: any) => setSelectedClients(e.value)}
          rows={rows}
          selection={selectedClients}
          selectionMode={rowClick ? null : 'checkbox'}
          sortField="user_name_last"
          sortOrder={1}
          stripedRows
          value={clients}
        >
          <Column selectionMode="multiple" header="" headerStyle={{ width: '3rem' }} hidden={isMobile}></Column>
          <Column body={nameTemplate} field="nachname" header="Name" sortable />
          <Column
            body={categoryTemplates}
            field="berufsstatus"
            filter
            filterElement={(options) => (
              <Dropdown
                options={job_categories}
                optionLabel="label"
                optionValue="value"
                value={options.value}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                placeholder="Status"
                showClear
              />
            )}
            header="Berufsstatus"
            hidden={isMobile}
          />
          <Column body={certificateTemplate} header="Zertifikatsdatei" hidden={isMobile}/>
          <Column
            body={(rowData) => formatDate(rowData.created_at)}
            field="created_at"
            header="Angemeldet seit"
            hidden={isMobile}
            sortable
            style={{ width: '15%' }}
          />
          <Column
            body={statusTemplate}
            field="status"
            filter
            filterMatchMode="equals"
            filterElement={(options) => (
              <Dropdown
                options={client_status}
                optionLabel="label"
                optionValue="value"
                value={options.value}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder="Status"
                showClear
              />
            )}
            header="Status"
            hidden={isMobile}
            sortable
          />
          <Column body={actionTemplate} header="Aktionen" hidden={isMobile}/>
        </DataTable>
      </div>
    </>
  );
}

export function ClientTableLatest() {
  //DATA
  const [clients, setClients] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientRes = await clientsLoadAll();
        setClients(clientRes);
      } catch (err) {}
    };

    fetchData();
  }, []);

  const actionTemplate = (rowData: User) => {
    return (
      <Link href={`/admin/kunden/${rowData.id}`}>
        <Button className="button-square" icon="pi pi-search" text />
      </Link>
    );
  };

  const userTemplate = (rowData: User) => {
    return (
      <div className="row gap-s align-center">
        <UserAvatarOther fontSize={11} height={30} user={rowData} width={30} />
        <div className="column">
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {rowData.user_name_last}, {rowData.user_name_first}
          </span>
          <span style={{ fontSize: 12 }}>Angemeldet seit: {formatDate(rowData.created_at)}</span>
        </div>
      </div>
    );
  };

  return (
    <DataTable
      emptyMessage="Keine Kunden gefunden."
      value={clients
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)}
    >
      <Column body={userTemplate} header="Kunde" />
      <Column body={actionTemplate} header="Aktionen" />
    </DataTable>
  );
}
