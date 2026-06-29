'use client';

import { User } from '@/app/types/Database';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';

interface Props {
  client: User;
}

export default function ClientActions({ client }: Props) {
  const op = useRef<OverlayPanel | null>(null);

  return (
    <>
      <OverlayPanel ref={op}>
        <div className="column gap-xs">
          <Button className="button-context" icon="pi pi-envelope" label="Kunden übertragen" />
        </div>
      </OverlayPanel>
      <Button label="Aktionen" onClick={(e) => op.current?.toggle(e)} />
    </>
  );
}
