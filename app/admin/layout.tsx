'use client';

import AdminSidebar from '@/app/components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { initialLoading } = useAuth();

  if (initialLoading) return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <i className="pi pi-spinner pi-spin" style={{ fontSize: 24 }} />
    </div>
  );
  
  return (
    <main className="page-dashboard">
      <AdminSidebar />
      <div className="page-admin">{children}</div>
    </main>
  );
}
