'use client';

import { ContextMenu } from 'primereact/contextmenu';
import { Certificate, Document } from '@/app/types/Database';
import styles from './Documents.module.css';
import { useRef } from 'react';
import Image from 'next/image';
import { document_options } from '@/app/constants/Constants';

interface Props {
  certificate: Certificate;
}

export default function CertificateFile({
  certificate,
}: Props) {

  return (
    <div
      className={styles.wrapper}
      style={{ backgroundColor: 'var(--background)' }}
    >
      <Image alt="" height={48} src="/icons/pdf.svg" width={48} />
      <span style={{ fontSize: 11 }}>{certificate.year}</span>
    </div>
  );
}
