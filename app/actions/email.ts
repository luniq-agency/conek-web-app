'use server';

import { createClient } from '@/app/utils/supabase/server';
import { Resend } from 'resend';
import { TemplateInvite } from '../components/emails/TemplateInvite';
import { Email, Invoice, InvoiceItem, User } from '../types/Database';
import { generateInvoicePDF } from './pdf';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  html?: string;
  id?: string;
  name: string;
  referrer?: string;
  subject?: string;
  templateId: string;
  text?: string;
  to: string;
}

export async function fetchEmails(): Promise<Email[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('email').select('*');

  if (error) throw new Error(error.message);
  return data || [];
}

export async function sendEmail(templateId: string, to: string, props: any) {
  const { data, error } = await resend.emails.send({
    from: 'CONEK <info@conek.de>',
    to,
    template: { id: templateId, variables: props },
  } as any);

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function sendEmailWithAttachment({
  to,
  subject,
  recipientName,
  invoiceNumber,
  pdfBuffer,
  pdfFilename,
}: {
  to: string;
  subject: string;
  recipientName: string;
  invoiceNumber: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}) {
  const { data, error } = await resend.emails.send({
    from: 'CONEK <info@conek.de>',
    to,
    subject,
    template: {
      id: 'rechnung',
      variables: { name: recipientName, invoice: invoiceNumber },
    },
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer.toString('base64'),
      },
    ],
  } as any);

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function sendInvoiceEmail(invoice: Invoice, items: InvoiceItem[], recipient: User) {
  // PDF direkt hier generieren – kein Transfer zum Client
  const buffer = await generateInvoicePDF(invoice, items, recipient);

  const { data, error } = await resend.emails.send({
    from: 'CONEK <info@conek.de>',
    to: recipient.email,
    subject: `Rechnung ${invoice.invoice_number}`,
    template: {
      id: 'rechnung',
      variables: {
        name: recipient.user_name_first,
        invoice: invoice.invoice_number,
      },
    },
    attachments: [
      {
        filename: `Rechnung-${invoice.invoice_number}.pdf`,
        content: buffer.toString('base64'),
      },
    ],
  } as any);

  if (error) throw new Error(JSON.stringify(error));
  return data;
}
