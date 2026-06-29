import ClientTable from '@/app/components/clients/ClientTable';
import styles from '../../components/admin/Admin.module.css';
import { Metadata } from 'next';
import DividerBlock from '@/app/components/DividerBlock';
import AdminClientCreate from '@/app/components/clients/AdminClientCreate';

export const metadata: Metadata = {
  title: 'Kunden | CONEK',
  description: '',
};

export default function AdminClientsPage() {
  return (
    <div className="page-content" style={{ height: '100%' }}>
      <div className="row space-between">
        <h1 className={styles.h1}>Kunden</h1>
        <AdminClientCreate />
      </div>
      <DividerBlock height={2} />
      <div className="container" style={{maxHeight: '100%'}}>
        <ClientTable />
      </div>
    </div>
  );
}
