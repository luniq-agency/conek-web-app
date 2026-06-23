'use client';

import { Client, Invoice, User } from '@/app/types/Database';
import { invoice_status } from '@/app/constants/Constants';
import { formatCurrency, formatDate } from '@/app/utils/formats';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import InvoiceEditor from './InvoiceEditor';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import {
  invoiceDelete,
  invoicesDeleteMultiple,
  invoicesLoadAll,
  invoicesLoadUser,
  invoiceUpdate,
} from '@/app/actions/invoice';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import AdminCreateInvoice from './AdminCreateInvoice';
import { useRouter } from 'next/navigation';

interface Props {
  clients?: User[];
  user?: User;
}

export default function InvoicesTable({ clients }: Props) {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const toast = useRef<Toast | null>(null);

  const op = useRef<OverlayPanel | null>(null);

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!clients) return;

    const fetchData = async () => {
      try {
        const res = await invoicesLoadAll();
        setInvoicesList(res);
      } catch {}
    };
    fetchData();
  }, [clients]);

  const [rowClick, setRowClick] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);

  const deleteDialog = (invoice: Invoice) => {
    confirmDialog({
      message: 'Bist du sicher, dass du diese Rechnung löschen möchtest?',
      header: 'Rechnung löschen',
      accept: () => acceptDelete(invoice),
      acceptLabel: 'Löschen',
      reject: rejectDelete,
      rejectLabel: 'Abbrechen',
    });
  };

  //AKTIONEN
  const acceptDelete = async (invoice: Invoice) => {
    if (!selectedInvoice) return;

    try {
      await invoiceDelete(selectedInvoice.id);
      const res = await invoicesLoadAll();
      setInvoicesList(res);
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnung gelöscht',
        detail: 'Die Rechnung wurde gelöscht.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMultipleInvoices = async () => {
    if (selectedInvoices.length === 0) return;

    try {
      await invoicesDeleteMultiple(selectedInvoices.map((i) => i.id));
      const res = await invoicesLoadAll();
      setInvoicesList(res);
      setSelectedInvoices([]);
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnungen gelöscht',
        detail: 'Die Rechnungen wurden erfolgreich gelöscht.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markInvoicePaid = async (rowData: Invoice) => {
    const payload = {
      invoice_status: 'paid',
    };

    try {
      await invoiceUpdate(payload, rowData.id);
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnung aktualisiert',
        detail: 'Die Rechnung wurde als bezahlt markiert.',
      });
    } catch (err) {
      console.error(err);
    } finally {
      const res = await invoicesLoadAll();
      setInvoicesList(res);
    }
  };

  const selectInvoice = (rowData: Invoice) => {
    setSelectedInvoice(rowData);
    setVisible(true);
  };

  const selectInvoiceforDelete = (rowData: Invoice) => {
    op.current?.hide();
    deleteDialog(rowData);
  };

  const sendInvoice = async (rowData: Invoice) => {
    console.log('Rechnung:', rowData);
    try {
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnung versendet',
        detail: 'Die Rechnung wurde an den Kunden versendet.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  //TEMPLATES
  const actionTemplate = (rowData: Invoice) => {
    return (
      <div className="row gap-xs">
        <ConfirmDialog />
        <OverlayPanel ref={op}>
          <div className="column gap-xs">
            <Button
              className="button-context"
              icon="pi pi-envelope"
              label="Rechnung versenden"
              onClick={() => sendInvoice(rowData as Invoice)}
            />
            <Button
              className="button-context"
              disabled={rowData.invoice_status === 'paid'}
              icon="pi pi-euro"
              label="Als bezahlt markieren"
              onClick={() => markInvoicePaid(rowData as Invoice)}
            />
            <Button
              className="button-context"
              disabled={rowData.invoice_status === 'paid' || rowData.invoice_status === 'sent'}
              icon="pi pi-trash"
              label="Rechnung löschen"
              onClick={() => selectInvoiceforDelete(rowData as Invoice)}
              style={{ color: 'red' }}
            />
          </div>
        </OverlayPanel>
        <Link href={`/admin/rechnungen/${rowData.id}`}>
          <Button className="button-square" icon="pi pi-pencil" />
        </Link>
        <Button
          className="button-square"
          icon="pi pi-ellipsis-v"
          onClick={(e) => op.current?.toggle(e)}
        />
      </div>
    );
  };

  const recipientTemplate = (rowData: Invoice) => {
    if (!clients) return;

    const client = clients.find((c) => c.id === rowData.user);
    if (!client) return <span>–</span>;
    return (
      <span>
        {client.user_name_last}, {client.user_name_first}
      </span>
    );
  };

  const rejectDelete = () => {
    op.current?.hide();
  };

  const statusTemplate = (rowData: Invoice) => {
    const statusObj = invoice_status.find((t) => t.value === rowData.invoice_status);
    return <Tag severity={(statusObj?.severity as any) ?? 'info'} value={statusObj?.label ?? ''} />;
  };

  const totalTemplate = (rowData: Invoice) => {
    return <span>{formatCurrency(rowData.invoice_total_gross)}</span>;
  };

  const show = async () => {
    const res = await invoicesLoadAll();
    setInvoicesList(res);
    toast.current?.show({
      severity: 'success',
      summary: 'Rechnung aktualisiert',
      detail: 'Die Rechnung wurde aktualisiert.',
    });
  };

  const sidebarHeader = () => {
    return <h3>Rechnung {selectedInvoice?.invoice_number}</h3>;
  };

  return (
    <>
      <Toast ref={toast} />
      <Sidebar
        header={sidebarHeader}
        onHide={() => setVisible(false)}
        position="right"
        style={{ maxWidth: '60vw', width: '100%' }}
        visible={visible}
      >
        {clients ? (
          <InvoiceEditor clients={clients} invoice={selectedInvoice!} onSubmit={show} />
        ) : (
          <div className="column">
            <span style={{ textAlign: 'center' }}>
              Es wurden noch keine Kunden angelegt. Bitte lege zuerst einen Kunden an, bevor du
              fortfährst.
            </span>
            <Link href="/admin/kunden">
              <Button label="zu den Kunden" />
            </Link>
          </div>
        )}
      </Sidebar>
      <DataTable
        emptyMessage="Keine Rechnungen gefunden."
        onSelectionChange={(e: any) => setSelectedInvoices(e.value)}
        paginator
        rows={10}
        sortField="invoice_number"
        sortOrder={-1}
        stripedRows
        value={invoicesList}
      >
        <Column field="invoice_number" header="#" sortable />
        <Column body={recipientTemplate} header="Empfänger" hidden={!clients} />
        <Column
          body={(rowData) => formatDate(rowData.created_at)}
          field="created_at"
          header="Datum"
          sortable
        />
        <Column body={totalTemplate} field="invoice_total_gross" header="Betrag" />
        <Column body={statusTemplate} field="status" header="Status" />
        <Column body={actionTemplate} header="Aktionen" />
      </DataTable>
    </>
  );
}

export function InvoicesTableUser({ user }: Props) {
  const { userProfile } = useAuth();
  const [visible, setVisible] = useState(false);
  const toast = useRef<Toast | null>(null);

  const op = useRef<OverlayPanel | null>(null);

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await invoicesLoadUser(user.id);
        setInvoicesList(res);
      } catch {}
    };
    fetchData();
  }, [user]);

  const [rowClick, setRowClick] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);

  const deleteDialog = (invoice: Invoice) => {
    confirmDialog({
      message: 'Bist du sicher, dass du diese Rechnung löschen möchtest?',
      header: 'Rechnung löschen',
      accept: () => acceptDelete(invoice),
      acceptLabel: 'Löschen',
      reject: rejectDelete,
      rejectLabel: 'Abbrechen',
    });
  };

  //AKTIONEN
  const acceptDelete = async (invoice: Invoice) => {
    if (!selectedInvoice) return;

    try {
      await invoiceDelete(selectedInvoice.id);
      const res = await invoicesLoadAll();
      setInvoicesList(res);
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnung gelöscht',
        detail: 'Die Rechnung wurde gelöscht.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMultipleInvoices = async () => {
    if (selectedInvoices.length === 0) return;

    try {
      await invoicesDeleteMultiple(selectedInvoices.map((i) => i.id));
      const res = await invoicesLoadAll();
      setInvoicesList(res);
      setSelectedInvoices([]);
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnungen gelöscht',
        detail: 'Die Rechnungen wurden erfolgreich gelöscht.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markInvoicePaid = async (rowData: Invoice) => {
    const payload = {
      invoice_status: 'paid',
    };

    try {
      await invoiceUpdate(payload, rowData.id);
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnung aktualisiert',
        detail: 'Die Rechnung wurde als bezahlt markiert.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const refreshInvoices = async () => {
    if (!user) return;
    const res = await invoicesLoadUser(user.id);
    setInvoicesList(res);
  };

  const selectInvoice = (rowData: Invoice) => {
    setSelectedInvoice(rowData);
    setVisible(true);
  };

  const selectInvoiceforDelete = (rowData: Invoice) => {
    op.current?.hide();
    deleteDialog(rowData);
  };

  const sendInvoice = async (rowData: Invoice) => {
    console.log('Rechnung:', rowData);
    try {
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnung versendet',
        detail: 'Die Rechnung wurde an den Kunden versendet.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  //TEMPLATES
  const actionTemplate = (rowData: Invoice) => {
    return (
      <div className="row gap-xs">
        <ConfirmDialog />
        <OverlayPanel ref={op}>
          <div className="column gap-xs">
            <Button className="button-context" icon="pi pi-envelope" label="Rechnung versenden" />
            <Button
              className="button-context"
              disabled={rowData.invoice_status === 'paid'}
              icon="pi pi-euro"
              label="Als bezahlt markieren"
              onClick={() => markInvoicePaid(rowData as Invoice)}
            />
            <Button
              className="button-context"
              disabled={rowData.invoice_status === 'paid' || rowData.invoice_status === 'sent'}
              icon="pi pi-trash"
              label="Rechnung löschen"
              onClick={() => selectInvoiceforDelete(rowData as Invoice)}
              style={{ color: 'red' }}
            />
          </div>
        </OverlayPanel>
        {userProfile?.user_role === 'admin' && (
          <>
            <Button
              className="button-square"
              icon="pi pi-pencil"
              onClick={(e) => selectInvoice(rowData as Invoice)}
            />
            <Button
              className="button-square"
              icon="pi pi-ellipsis-v"
              onClick={(e) => op.current?.toggle(e)}
            />
          </>
        )}
      </div>
    );
  };

  const rejectDelete = () => {
    op.current?.hide();
  };

  const statusTemplate = (rowData: Invoice) => {
    const statusObj = invoice_status.find((t) => t.value === rowData.invoice_status);
    return <Tag severity={(statusObj?.severity as any) ?? 'info'} value={statusObj?.label ?? ''} />;
  };

  const totalTemplate = (rowData: Invoice) => {
    return <span>{formatCurrency(rowData.invoice_total_gross)}</span>;
  };

  const show = async () => {
    const res = await invoicesLoadAll();
    setInvoicesList(res);
    toast.current?.show({
      severity: 'success',
      summary: 'Rechnung aktualisiert',
      detail: 'Die Rechnung wurde aktualisiert.',
    });
  };

  const sidebarHeader = () => {
    return <h3>Rechnung {selectedInvoice?.invoice_number}</h3>;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="column gap-m">
        <div className="row space-between">
          <h3>Rechnungen</h3>
          <AdminCreateInvoice
            onCreate={refreshInvoices}
            secondary={true}
            user={user}
            users={user ? [user] : []}
          />
        </div>
        {selectedInvoices.length >= 1 && (
          <Button label="Löschen" onClick={deleteMultipleInvoices} />
        )}
        <DataTable
          emptyMessage="Keine Rechnungen gefunden."
          onSelectionChange={(e: any) => setSelectedInvoices(e.value)}
          paginator
          rows={10}
          selection={selectedInvoices}
          selectionMode={rowClick ? null : 'checkbox'}
          stripedRows
          value={invoicesList}
        >
          <Column selectionMode="multiple" header="" headerStyle={{ width: '3rem' }}></Column>
          <Column field="invoice_number" header="#" sortable />
          <Column
            body={(rowData) => formatDate(rowData.created_at)}
            field="created_at"
            header="Datum"
            sortable
          />
          <Column body={totalTemplate} field="invoice_total_gross" header="Betrag" />
          <Column body={statusTemplate} field="status" header="Status" />
          <Column body={actionTemplate} header="Aktionen" />
        </DataTable>
      </div>
    </>
  );
}
