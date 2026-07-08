import AdminDashboard from '../components/pages/admin/Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mein Dashboard | CONEK',
  description: '',
};

export default function Page() {
  return (
    <AdminDashboard />
  );
}
