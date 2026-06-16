import { agencyLoadAll } from '@/app/actions/agency';
import styles from '../../components/admin/Admin.module.css';
import AdminCreateAgency from '@/app/components/admin/agency/AdminCreateAgency';
import AgencyTable from '@/app/components/admin/agency/AgencyTable';
import DividerBlock from '@/app/components/DividerBlock';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agenturen | CONEK',
  description: '',
};

export default async function AdminAgenciesPage() {
  const agents = await agencyLoadAll();

  return (
    <div className="page-content">
      <div className="row space-between">
        <h1 className={styles.h1}>Agenturen</h1>
        <AdminCreateAgency />
      </div>
      <DividerBlock height={2} />
      <div className="container">
        <AgencyTable agents={agents} />
      </div>
    </div>
  );
}
