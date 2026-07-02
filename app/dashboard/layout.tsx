import DashboardSidebar from '../components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-dashboard" style={{ backgroundColor: 'white' }}>
      <DashboardSidebar />
      <div className="page-content" style={{padding:0}}>{children}</div>
    </main>
  );
}
