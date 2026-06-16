import AdminSidebar from '@/app/components/admin/AdminSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adminbereich | CONEK',
  description: '',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-dashboard">
      <AdminSidebar />
      <div className="page-admin">{children}</div>
    </main>
  );
}
