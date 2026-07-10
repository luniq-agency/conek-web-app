'use client';

import { documentUpload } from '@/app/actions/documents';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { FormEvent, useState } from 'react';
import { FileUploader } from '../forms/Uploaders';
import { sanitizeFileName } from '@/app/utils/sanitize';
import { PrimaryButton, SecondaryButton } from '../buttons/Buttons';

interface Props {
  folder: string | null;
  onUpload: () => void;
  owner: string | number;
}

export default function DocumentUploader({ folder, onUpload, owner }: Props) {
  // STATES
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // INPUTS
  const [documentFile, setDocumentFile] = useState<{ file: File } | null>(null);
  const [documentFileType, setDocumentFileType] = useState('');
  const [documentName, setDocumentName] = useState('');

  // ACTIONS
  const cancel = () => {
    setVisible(false);
    setDocumentFile(null);
    setDocumentFileType('');
    setDocumentName('');
  };
  const handleUpload = (file: File, fileType: string) => {
    setDocumentFile({ file });
    setDocumentFileType(fileType);
  };

  const uploadDocument = async () => {
    setSubmitting(true);
    console.log('Owner:', owner);
    console.log('Datei:', documentFile);
    if (!documentFile || !owner) return;

    const name = sanitizeFileName(documentName);

    try {
      await documentUpload(documentFile.file, name, documentFileType, documentName, owner, folder);
      setDocumentFile(null);
      setDocumentName('');
    } catch (err) {
      console.error('Upload Fehler:', err);
    } finally {
      setSubmitting(false);
      setVisible(false);
    }
  };

  return (
    <>
      <Dialog
        header="Dokument hochladen"
        onHide={() => setVisible(false)}
        style={{ maxWidth: 400, width: '100%' }}
        visible={visible}
      >
        <div className="column gap-m">
          <FileUploader
            label={documentFile?.file.name || 'Datei auswählen'}
            onUpload={handleUpload}
          />
          <InputText
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Name (z. B. Steuererklärung 2024)"
            value={documentName}
          />
          <div className="row gap-s width-100 space-between">
            <SecondaryButton label="Abbrechen" onClick={cancel} />
            <PrimaryButton
              disabled={!documentFile || !documentName}
              label="Hochladen"
              onClick={uploadDocument}
            />
          </div>
        </div>
      </Dialog>
      <Button
        className="button-secondary"
        icon="pi pi-upload"
        label="Dokument hochladen"
        onClick={() => setVisible(true)}
      />
    </>
  );
}
