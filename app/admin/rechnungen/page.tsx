import styles from '../../components/admin/Admin.module.css';
import { Metadata } from 'next';
import DividerBlock from '@/app/components/DividerBlock';
import InvoicesTable from '@/app/components/admin/invoices/InvoicesTable';
import { invoicesLoadAll } from '@/app/actions/invoice';
import AdminCreateInvoice from '@/app/components/admin/invoices/AdminCreateInvoice';
import { clientsLoadAll } from '@/app/actions/clients';

export const metadata: Metadata = {
  title: 'Rechnungen | CONEK',
  description: '',
};

export default async function AdminInvoicesPage() {
  const clients = await clientsLoadAll();
  const invoices = await invoicesLoadAll();

  return (
    <div className="page-content">
      <div className="row space-between">
        <h1 className={styles.h1}>Rechnungen</h1>
        <AdminCreateInvoice users={clients} />
      </div>
      <DividerBlock height={2} />
      <div className="container">
        <InvoicesTable clients={clients} />
      </div>
    </div>
  );
}
