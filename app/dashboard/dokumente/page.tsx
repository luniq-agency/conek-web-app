import DocumentViewer from '@/app/components/admin/documents/DocumentViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meine Dokumente | CONEK',
  description: '',
};

export default function DashboardDocumentsPage() {
  return (
    <div className="content-wrapper" style={{ height: '100%' }}>
      <DocumentViewer backgroundColor="var(--button-secondary)" />
    </div>
  );
}
