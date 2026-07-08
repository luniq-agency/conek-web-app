import { BreadCrumb } from 'primereact/breadcrumb';
import { Metadata } from 'next';
import DividerBlock from '@/app/components/DividerBlock';
import { clientsLoadAdmin, clientsLoadAll } from '@/app/actions/clients';
import { invoiceLoadSingle } from '@/app/actions/invoice';
import InvoiceEditor from '@/app/components/admin/invoices/InvoiceEditor';
import InvoiceActions from '@/app/components/invoices/InvoicesActions';

export const metadata: Metadata = {
  title: 'Rechnung | CONEK',
  description: '',
};

export default async function AdminInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await invoiceLoadSingle(id);
  const clients = await clientsLoadAdmin();

  const items = [
    {
      label: 'Rechungen',
      url: '/admin/rechnungen',
    },
    {
      label: `Rechnung ${invoice.invoice_number}`,
    },
  ];

  const home = { icon: 'pi pi-home', url: '/admin' };

  // ACTIONS

  return (
    <div className="page-content column">
      <BreadCrumb home={home} model={items} />
      <DividerBlock height={2} />
      <div className="row space-between">
        <div className="row gap-xs align-center">
        <h1>Rechnung</h1>
        </div>
        <InvoiceActions invoice={invoice} />
      </div>
      <DividerBlock height={2} />
      <div className="container grow">
        <InvoiceEditor clients={clients} invoice={invoice} />
      </div>
    </div>
  );
}
