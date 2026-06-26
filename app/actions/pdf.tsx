'use server';

import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePDF } from '@/app/components/pdf/InvoicePDF';
import { Invoice, InvoiceItem, User } from '../types/Database';

export async function generateInvoicePDF(
  invoice: Invoice,
  items: InvoiceItem[],
  recipient: User
): Promise<Buffer> {
  console.log('Invoice:', invoice.invoice_number);
  console.log('Items:', items.length);
  console.log('Recipient:', recipient.user_name_first);

  const buffer = await renderToBuffer(
    React.createElement(InvoicePDF, { invoice, items, recipient }) as any
  );
  return Buffer.from(buffer); // ← explizit als Buffer
}
