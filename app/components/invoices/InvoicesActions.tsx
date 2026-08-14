'use client';

import { Invoice } from '@/app/types/Database';
import { invoiceUpdate } from '@/app/actions/invoice';
import { sendInvoiceEmail } from '@/app/actions/email';
import { userLookup } from '@/app/actions/users';
import { invoiceItemsLoad } from '@/app/actions/invoiceitem';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';

interface Props {
  invoice: Invoice;
}

export default function InvoiceActions({ invoice }: Props) {
  const [sending, setSending] = useState(false);

  const op = useRef<OverlayPanel | null>(null);
  const router = useRouter();
  const toast = useRef<Toast | null>(null);

  const sendInvoice = async () => {
    setSending(true);
    op.current?.hide();
    try {
      const payload = {
        invoice_date_sent: new Date(),
        invoice_status: 'sent',
      };

      const recipient = await userLookup(invoice.user);
      const items = await invoiceItemsLoad(invoice.id);

      await sendInvoiceEmail(invoice, items, recipient);
      await invoiceUpdate(payload, invoice.id);
      toast.current?.show({
        severity: 'success',
        summary: 'Rechnung versendet',
        detail: 'Die Rechnung wurde an den Kunden versendet.',
      });
      setSending(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <OverlayPanel ref={op}>
        <div className="column gap-xs">
          <Button
            className="button-context"
            disabled={sending || !invoice.user}
            icon="pi pi-envelope"
            label="Rechnung versenden"
            onClick={sendInvoice}
          />
          <Button
            className="button-context"
            disabled={invoice.invoice_status === 'paid'}
            icon="pi pi-euro"
            label="Als bezahlt markieren"
          />
          <Button
            className="button-context"
            disabled={invoice.invoice_status === 'paid' || invoice.invoice_status === 'sent'}
            icon="pi pi-trash"
            label="Rechnung löschen"
            style={{ color: 'red' }}
          />
        </div>
      </OverlayPanel>
      <Button label="Aktionen" onClick={(e) => op.current?.toggle(e)} />
    </div>
  );
}
