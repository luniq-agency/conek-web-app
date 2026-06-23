'use client';

import { AgencyStats, Agent, User } from '@/app/types/Database';
import { agent_status } from '@/app/constants/Constants';
import { formatDate } from '@/app/utils/formats';
import { stat } from 'fs';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/navigation';

interface Props {
  agents: AgencyStats[];
}

export default function AgencyTable({ agents }: Props) {
  const router = useRouter();

  const nameTemplate = (rowData: AgencyStats) => {
    return (
      <span>
        {rowData.user_name_last}, {rowData.user_name_first}
      </span>
    );
  };

  const selectAgent = (rowData: AgencyStats) => {
    router.push(`/admin/agenturen/${rowData.id}`);
  };

  return (
    <DataTable
      emptyMessage="Keine Agenturen gefunden."
      onRowClick={(e) => selectAgent(e.data as AgencyStats)}
      paginator
      rows={10}
      sortField="user_name_last"
      sortOrder={1}
      stripedRows
      value={agents}
    >
      <Column body={nameTemplate} header="Name" />
      <Column field="firma" header="Firma" />
      <Column field="client_count" header="Kunden" />
      <Column body={(rowData) => formatDate(rowData.created_at)} header="Angemeldet seit" />
    </DataTable>
  );
}
