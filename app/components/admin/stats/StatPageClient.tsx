'use client';

import DividerBlock from '@/app/components/DividerBlock';
import CertificateStatCard from '@/app/components/stats/CertificateStatCard';
import ClientStatCards from '@/app/components/stats/ClientStatCard';
import InvoiceStatCards from '@/app/components/stats/InvoiceStatCard';
import RevealBox from '@/app/components/ui/RevealBox';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';

const viewOptions = [
  {
    label: 'Monat',
    value: 'month',
  },
  {
    label: 'Jahr',
    value: 'year',
  },
  {
    label: 'Gesamt',
    value: 'all',
  },
];
export default function StatPageClient() {
  const [view, setView] = useState<'month' | 'year' | 'all'>('month');

  return (
    <div className="page-content">
      <div className="row align-center space-between">
        <h1>Statistiken</h1>
        <Dropdown onChange={(e) => setView(e.value)} options={viewOptions} value={view} />
      </div>
      <DividerBlock height={1} />
      <div className="grid columns-two gap-m mobile-column">
        <RevealBox delay={0.5}>
          <div className="column gap-m">
            <h3>Zertifikate</h3>
            <CertificateStatCard view={view} />
          </div>
        </RevealBox>
        <RevealBox delay={1}>
          <div className="column gap-m">
            <h3>Rechnungen</h3>
            <InvoiceStatCards view={view} />
          </div>
        </RevealBox>
      </div>
      <DividerBlock height={2} />
      <RevealBox delay={1.5}>
        <div className="column">
          <h3>Anmeldungen</h3>
          <DividerBlock height={1} />
          <ClientStatCards view={view} />
        </div>
      </RevealBox>
    </div>
  );
}
