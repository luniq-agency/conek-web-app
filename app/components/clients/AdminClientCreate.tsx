'use client';

import { Button } from 'primereact/button';
import { Client } from '@/app/types/Database';
import { clientInvite } from '@/app/actions/clients';
import { Dialog } from 'primereact/dialog';
import { family_options, job_categories } from '@/app/constants/Constants';
import {
  DatePicker,
  NumberInputLabel,
  SelectLabel,
  TextInputLabel,
} from '@/app/components/forms/FormElements';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminClientCreate() {
  const { userProfile } = useAuth();
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

  //FORM
  const [beruf, setBeruf] = useState('');
  const [berufsstatus, setBerufsstatus] = useState('');
  const [email, setEmail] = useState('');
  const [family, setFamily] = useState('');
  const [iban, setIban] = useState('');
  const [geburtsdatum, setGeburtsdatum] = useState<Date | null>(null);
  const [kinder, setKinder] = useState(0);
  const [nachname, setNachname] = useState('');
  const [vorname, setVorname] = useState('');

  const isValid = vorname && nachname && email;

  //USER EINLADEN
  const createUser = async () => {
    if (!geburtsdatum) return;

    setSubmitting(true);
    const clientPayload = {
      beruf,
      berufsstatus,
      created_by: userProfile?.id,
      email,
      family_status: family || 'unmarried',
      geburtsdatum: geburtsdatum.toISOString().split('T')[0],
      iban,
      kinder,
      nachname,
      status: 'pending',
      vorname,
    };

    const userPayload = {
      email,
      user_name_first: vorname,
      user_name_last: nachname,
      user_role: 'client',
    };

    try {
      await clientInvite(clientPayload, userPayload);
      setVisible(false);
      setSubmitting(false);
      setBeruf('');
      setBerufsstatus('');
      setEmail('');
      setFamily('');
      setGeburtsdatum(null);
      setIban('');
      setKinder(0);
      setNachname('');
    } catch (err) {
      console.error(err);
    }
    setSelectedClient(null);
    router.refresh();
  };

  return (
    <>
      <Dialog
        closable={true}
        draggable={false}
        header="Kunde erstellen"
        onHide={() => setVisible(false)}
        style={{ maxWidth: 640, width: '100%' }}
        visible={visible}
      >
        <div className="column gap-m">
          <div className="column gap-m">
            <div className="row gap-m mobile-column width-100">
              <TextInputLabel label="Vorname" onChange={setVorname} value={vorname} />
              <TextInputLabel label="Nachname" onChange={setNachname} value={nachname} />
            </div>
            <TextInputLabel label="E-Mail" onChange={setEmail} value={email} />
            <div className="row gap-m mobile-column width-100">
              <DatePicker
                dateValue={geburtsdatum || maxDate}
                label="Geburtsdatum"
                maxDate={maxDate}
                onDateChange={setGeburtsdatum}
                placeholder="dd.mm.yyyy"
              />
              <TextInputLabel
                additional="(Optional)"
                label="IBAN"
                onChange={setIban}
                value={iban}
              />
            </div>
            <div className="row gap-m mobile-column width-100">
              <TextInputLabel
                additional="(Optional)"
                label="Beruf"
                onChange={setBeruf}
                value={beruf}
              />
              <SelectLabel
                label="Berufsstatus"
                onChange={setBerufsstatus}
                value={berufsstatus}
                optionLabel="label"
                optionValue="value"
                options={job_categories}
              />
            </div>
            <div className="row gap-m mobile-column width-100">
              <SelectLabel
                label="Familenstand"
                onChange={setFamily}
                optionLabel="label"
                optionValue="value"
                options={family_options}
                value={family}
              />
              <NumberInputLabel label="Kinder" onNumberChange={setKinder} numberValue={kinder} />
            </div>
            <Button
              disabled={!isValid || submitting}
              icon={submitting ? 'pi pi-spinner' : undefined}
              label="Kunde erstellen"
              onClick={createUser}
            />
          </div>
        </div>
      </Dialog>
      <Button
        className="button-primary"
        icon="pi pi-plus"
        label="Kunden anlegen"
        onClick={() => setVisible(true)}
      />
    </>
  );
}
