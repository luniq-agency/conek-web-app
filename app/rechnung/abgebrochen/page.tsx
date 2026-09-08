import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CONEK',
  description: '',
};

export default function AbgebrochenPage() {
  return (
    <div className="page-content column" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h1>Zahlung abgebrochen</h1>
      <p>Die Zahlung wurde nicht abgeschlossen. Sie können es jederzeit erneut versuchen.</p>
    </div>
  );
}
