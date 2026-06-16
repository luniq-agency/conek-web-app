'use client';

import { Agent, User } from '@/app/types/Database';
import { client_status } from '@/app/constants/Constants';
import { formatDate } from '@/app/utils/formats';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';

interface Props {
  admins: User[];
}

export default function AdminsTable({ admins }: Props) {
  const nameTemplate = (rowData: User) => {
    return (
      <span>
        {rowData.user_name_last}, {rowData.user_name_first}
      </span>
    );
  };

  const statusTemplate = (rowData: Agent) => {
    const status = client_status.find((t) => t.value === rowData.status)?.label ?? '';
    return <Tag value={status}></Tag>;
  };

  return (
    <DataTable
      emptyMessage="Keine Agenturen gefunden."
      paginator
      rows={10}
      sortField="user_name_last"
      sortOrder={1}
      stripedRows
      value={admins}
    >
      <Column body={nameTemplate} header="Name" />
      <Column body={(rowData) => formatDate(rowData.created_at)} header="Angemeldet seit" />
      <Column body={statusTemplate} header="Status" />
    </DataTable>
  );
}
