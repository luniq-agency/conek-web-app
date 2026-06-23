import { BreadCrumb } from 'primereact/breadcrumb';
import { Metadata } from 'next';
import DividerBlock from '@/app/components/DividerBlock';
import { clientLoadSingle, clientLookup, clientsLoadAll } from '@/app/actions/clients';
import ClientActions from '@/app/components/admin/clients/ClientActions';
import { userUpdatesLoad } from '@/app/actions/update';
import ClientTabs from '@/app/components/admin/clients/ClientTabs';
import { formatDate } from '@/app/utils/formats';
import { UserAvatarOther } from '@/app/components/UserAvatar';
import { userLookup } from '@/app/actions/users';
import { invoiceLoadSingle } from '@/app/actions/invoice';
import InvoiceEditor from '@/app/components/admin/invoices/InvoiceEditor';

export const metadata: Metadata = {
  title: 'Rechnung | CONEK',
  description: '',
};

export default async function AdminInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await invoiceLoadSingle(id);
  const clients = await clientsLoadAll();
  const user = await userLookup(id);

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

  if (!user) return;

  return (
    <div className="page-content column">
      <BreadCrumb home={home} model={items} />
      <DividerBlock height={2} />
      <div className="container">
        <InvoiceEditor clients={clients} invoice={invoice} />
      </div>
    </div>
  );
}
