export const agent_status = [
  {
    label: 'Eingeladen',
    severity: 'warning',
    value: 'invited',
  },
  {
    label: 'Aktiv',
    severity: 'success',
    value: 'active',
  },
];

export const client_status = [
  {
    bg: '',
    label: 'Ausstehend',
    severity: 'warning',
    value: 'pending',
  },
  {
    bg: 'var(--warning-bg)',
    color: 'var(--warning-text)',
    label: 'Wird überprüft',
    severity: 'contrast',
    value: 'in_review',
  },
  {
    bg: 'var(--success-bg)',
    color: 'var(--success-text)',
    label: 'Aktiv',
    severity: 'info',
    value: 'approved',
  },
  {
    bg: '',
    label: 'Wiedervorlage',
    severity: 'contrast',
    value: 'on_hold',
  },
  {
    bg: 'var(--success-text)',
    color: 'white',
    label: 'Abgeschlossen',
    severity: 'success',
    value: 'completed',
  },
];

export const document_options = [
  {
    label: 'Bild',
    icon: '/icons/image.svg',
    value: 'image',
  },
  {
    label: 'PDF',
    icon: '/icons/pdf.svg',
    value: 'pdf',
  },
  {
    label: 'ZIP',
    icon: '/icons/zip.svg',
    value: 'zip',
  },
];

export const family_options = [
  {
    label: 'Ledig',
    value: 'single',
  },
  {
    label: 'Verheiratet',
    value: 'married',
  },
  {
    label: 'Geschieden',
    value: 'divorced',
  },
];

export const invoice_status = [
  {
    label: 'Entwurf',
    severity: 'primary',
    value: 'draft',
  },
  {
    label: 'Gesendet',
    severity: 'warning',
    value: 'sent',
  },
  {
    label: 'Bezahlt',
    severity: 'success',
    value: 'paid',
  },
  {
    label: 'Überfällig',
    severity: 'danger',
    value: 'overdue',
  },
];

export const job_categories = [
  {
    bg: '#124559',
    label: 'Angestellt',
    color: 'white',
    value: 'employed',
  },
  {
    bg: '#FCEC52',
    label: 'Freelancer',
    color: 'black',
    value: 'freelancer',
  },
  {
    bg: '#EF709D',
    label: 'Selbstständig',
    color: 'white',
    value: 'self-employed',
  },
];

export const notification_types = [
  {
    value: 'client'
  },
  {
    value: 'task'
  }
]

export const service_options = [
  {
    label: 'Behördenkommunikation',
  },
  {
    label: 'Gewerbeanmeldung',
  },
  {
    label: 'Buchhaltung',
  },
  {
    label: 'Steuererklärung',
  },
  {
    label: 'Anderes',
  },
];

export const task_status = [
  {
    label: 'Offen',
    severity: 'primary',
    value: 'open',
  },
  {
    label: 'Geschlossen',
    severity: 'success',
    value: 'closed',
  },
  {
    label: 'Überfällig',
    severity: 'error',
    value: 'overdue',
  },
  {
    label: 'Wiedervorlage',
    severity: 'info',
    value: 'on_hold'
  }
];

export const tax_rates = [
  {
    label: 'Brutto (19% inbegriffen)',
    multiplier: 19,
    value: 'gross',
  },
  {
    label: 'Netto (19% obendrauf)',
    multiplier: 19,
    value: 'net',
  },
];

export const ticket_options = [
  {
    label: 'Frage zu CONEK',
    value: 'general',
  },
  {
    label: 'Technischer Support',
    value: 'tech_support',
  },
];

export const ticket_status = [
  {
    label: 'Neu',
    severity: 'info',
    value: 'new',
  },
  {
    label: 'Geöffnet',
    severity: 'primary',
    value: 'opened',
  },
  {
    label: 'Warten auf Antwort',
    severity: 'warning',
    value: 'answered',
  },
  {
    label: 'Geschlossen',
    severity: 'Success',
    value: 'closed',
  },
];
