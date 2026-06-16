'use client';

import { Agent } from '@/app/types/Database';
import { agent_status } from '@/app/constants/Constants';
import { formatDate } from '@/app/utils/formats';
import { stat } from 'fs';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/navigation';

interface Props {
  agents: Agent[];
}

export default function AgencyTable({ agents }: Props) {
  const router = useRouter();

  const nameTemplate = (rowData: Agent) => {
    return (
      <span>
        {rowData.nachname}, {rowData.vorname}
      </span>
    );
  };

  const selectAgent = (rowData: Agent) => {
    router.push(`/admin/agenturen/${rowData.id}`);
  };

  const statusTemplate = (rowData: Agent) => {
    const status = agent_status.find((t) => t.value === rowData.status);
    return <Tag severity={(status?.severity as any) ?? 'info'} value={status?.label ?? ''}></Tag>;
  };

  return (
    <DataTable
      emptyMessage="Keine Agenturen gefunden."
      onRowClick={(e) => selectAgent(e.data as Agent)}
      paginator
      rows={10}
      sortField="nachname"
      sortOrder={1}
      stripedRows
      value={agents}
    >
      <Column body={nameTemplate} header="Name" />
      <Column field="firma" header="Firma" />
      <Column body={(rowData) => formatDate(rowData.created_at)} header="Angemeldet seit" />
      <Column body={statusTemplate} header="Status" />
    </DataTable>
  );
}
