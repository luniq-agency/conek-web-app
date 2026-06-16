'use server';

import { createClient } from '@/app/utils/supabase/server';
import { Resend } from 'resend';
import { TemplateInvite } from '../components/emails/TemplateInvite';
import { Email } from '../types/Database';

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
  const templates: Record<string, (props: any) => React.ReactElement> = {
    agencyInvite: TemplateInvite,
  };

  const subjects: Record<string, string> = {
    agencyInvite: 'Du wurdest zu CONEK eingeladen',
  };

  const template = templates[templateId];
  if (!template) throw new Error(`Template '${templateId}' nicht gefunden`);

  const { data, error } = await resend.emails.send({
    from: 'CONEK <info@conek.de>',
    to,
    subject: subjects[templateId],
    react: template(props),
  });

  console.log('Resend data:', data);
  console.log('Resend error:', error);

  if (error) throw new Error(JSON.stringify(error));
  return data;
}
