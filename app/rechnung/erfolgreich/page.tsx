import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CONEK',
  description: '',
};

export default function ErfolgPage() {
  return (
    <div className="page-content column" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h1>Vielen Dank für Ihre Zahlung!</h1>
      <p>Ihre Rechnung wurde erfolgreich beglichen.</p>
    </div>
  );
}
