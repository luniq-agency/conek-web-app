'use client';

import { useState, useEffect, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Certificate, User } from '@/app/types/Database';
import DocumentViewer from '../documents/DocumentViewer';
import { InvoicesTableUser } from '../admin/invoices/InvoicesTable';
import CertificateFile from '../documents/CertificateFile';
import { certificatesLoadUser } from '@/app/actions/certificates';
import DividerBlock from '../DividerBlock';
import { adminsLoadAll } from '@/app/actions/admin';
import SubscriptionEditor from '../subscriptions/SubscriptionEditor';
import { useAuth } from '@/app/context/AuthContext';
import CertificateUploader from '../certificates/CertificateUploader';
import AufgabenTable from '../aufgaben/AufgabenTable';
import Grid from '../layout/Grid';
import {
  NumberInputLabel,
  SelectLabel,
  TextAreaLabel,
  TextInputLabel,
} from '../forms/FormElements';
import { family_options, job_categories } from '@/app/constants/Constants';
import { DatePicker } from '../forms/datepicker/DatePicker';
import Row from '../layout/Row';
import { userUpdate } from '@/app/actions/users';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { changeUserEmail } from '@/app/actions/users/auth';
import { SecondaryButton } from '../buttons/Buttons';
import Column from '../layout/Column';
import ErrorMessage from '../ui/ErrorMessage';

interface Props {
  onChange: (changed: boolean) => void;
  onSaveRef: (fn: () => void) => void;
  user: User;
}

export default function ClientTabs({ onChange, onSaveRef, user }: Props) {
  const { userProfile } = useAuth();
  const [mounted, setMounted] = useState(false);

  // STATES
  const [activeIndex, setActiveIndex] = useState(0);
  const [changing, setChanging] = useState(false);
  const editorRef = useRef<{ save: () => void } | null>(null);
  const [error, setError] = useState('');
  const contactEditorRef = useRef<{ save: () => void } | null>(null);

  const handleTabChange = (e: { index: number }) => {
    // Auto-save beim Tab-Wechsel
    if (activeIndex === 0) editorRef.current?.save();
    if (activeIndex === 1) contactEditorRef.current?.save();
    setActiveIndex(e.index);
  };

  // DATA
  const [admins, setAdmins] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // CLIENT DATA
  const [city, setCity] = useState(user.city || '');
  const [clientDob, setClientDob] = useState<Date | null>(user.dob ? new Date(user.dob) : null);
  const [email, setEmail] = useState(user.email || '');
  const [clientFamily, setClientFamily] = useState(user.family_status || '');
  const [iban, setIban] = useState(user.iban || '');
  const [clientJob, setClientJob] = useState(user.job || '');
  const [clientJobType, setClientJobType] = useState(user.job_status || '');
  const [clientKids, setClientKids] = useState(user.kinder || 0);
  const [clientNachname, setClientNachname] = useState(user.user_name_last || '');
  const [clientNotes, setClientNotes] = useState(user.notizen || '');
  const [plz, setPlz] = useState(user.plz || '');
  const [steuerid, setSteuerid] = useState(user.steuer_id || '');
  const [street, setStreet] = useState(user.anschrift || '');
  const [telefon, setTelefon] = useState(user.telefon || '');
  const [clientVorname, setClientVorname] = useState(user.user_name_first || '');
  const [clientStatus, setClientStatus] = useState(user.status || '');
  const [clientTaxId, setClientTaxId] = useState(user.steuer_id || '');

  const isAdmin = userProfile?.user_role === 'admin';

  // SAVING
  const save = async () => {
    const payload = {
      anschrift: street,
      city,
      dob: clientDob ? clientDob.toISOString().split('T')[0] : undefined,
      email,
      family_status: clientFamily,
      iban,
      job: clientJob,
      job_status: clientJobType,
      kinder: clientKids,
      notizen: clientNotes,
      plz,
      steuer_id: steuerid,
      telefon,
      user_name_first: clientVorname,
      user_name_last: clientNachname,
    };
    await userUpdate(payload, user.id);

    // Ursprungswerte nach dem Speichern aktualisieren
    originalValues.current = {
      email,
      user_name_first: clientVorname,
      user_name_last: clientNachname,
      job: clientJob,
      iban: iban,
      kinder: clientKids,
      family_status: clientFamily,
      dob: clientDob?.toISOString().split('T')[0] ?? null,
      steuerid,
      telefon,
    };

    onChange(false);
  };

  useEffect(() => {
    onSaveRef(save);
  }, [
    clientVorname,
    clientNachname,
    clientJob,
    iban,
    clientKids,
    clientFamily,
    clientDob,
    email,
    steuerid,
    street,
    telefon,
    city,
    plz,
  ]);

  // INIT
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await certificatesLoadUser(user.id);
        setCertificates(res);
        const adminRes = await adminsLoadAll();
        setAdmins(adminRes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    setMounted(true);
  }, [user]);

  const originalValues = useRef({
    email: user.email,
    user_name_first: user.user_name_first,
    user_name_last: user.user_name_last,
    job: user.job,
    iban: user.iban,
    kinder: user.kinder,
    family_status: user.family_status,
    dob: user.dob,
    steuerid: user.steuer_id,
    telefon: user.telefon,
  });

  const isChanged =
    iban != originalValues.current.iban ||
    steuerid != originalValues.current.steuerid ||
    telefon !== originalValues.current.telefon ||
    clientVorname !== originalValues.current.user_name_first ||
    clientNachname !== originalValues.current.user_name_last ||
    clientJob !== originalValues.current.job ||
    clientKids !== originalValues.current.kinder ||
    clientFamily !== originalValues.current.family_status ||
    (clientDob?.toISOString().split('T')[0] ?? null) !== originalValues.current.dob;

  const refreshCertificates = async () => {
    const res = await certificatesLoadUser(user.id);
    setCertificates(res);
  };

  useEffect(() => {
    onChange(isChanged);
  }, [isChanged]);

  const changeEmail = async () => {
    console.log('Email:', email);
    try {
      await changeUserEmail(user.id, email);
    } catch (err) {
      setError('Diese E-Mail-Adresse wird schon verwendet.');
    }
  };

  if (!mounted || !user) return null;

  return (
    <>
      <Dialog
        draggable={false}
        header="E-Mail-Adresse ändern"
        onHide={() => setChanging(false)}
        style={{ maxWidth: 400 }}
        visible={changing}
      >
        <Column>
          <TextInputLabel onChange={setEmail} value={email} />
          <Button label="E-Mail-Adresse ändern" onClick={changeEmail} />
          {error && <ErrorMessage message={error} />}
        </Column>
      </Dialog>
      <TabView activeIndex={activeIndex} onTabChange={handleTabChange} style={{ height: '100%' }}>
        <TabPanel header="Stammdaten">
          <Grid columns={2} gap={16}>
            <TextInputLabel label="Vorname" onChange={setClientVorname} value={clientVorname} />
            <TextInputLabel label="Nachname" onChange={setClientNachname} value={clientNachname} />
            <TextInputLabel label="Beruf" onChange={setClientJob} value={clientJob} />
            <SelectLabel
              label="Jobverhältnis"
              onChange={setClientJobType}
              optionLabel="label"
              optionValue="value"
              options={job_categories}
              value={clientJobType}
            />
            <DatePicker
              label="Geburtsdatum"
              onChange={(e) => setClientDob(e as Date | null)}
              value={clientDob}
            />
            <SelectLabel
              label="Familienstand"
              onChange={setClientFamily}
              optionLabel="label"
              optionValue="value"
              options={family_options}
              value={clientFamily}
            />
            <NumberInputLabel
              label="Kinder"
              numberValue={clientKids}
              onNumberChange={setClientKids}
            />
            <TextInputLabel label="IBAN" onChange={setIban} value={iban} />
            <TextInputLabel label="Steuer-ID" onChange={setSteuerid} value={steuerid} />
            <div />
            <TextAreaLabel label="Notizen" onChange={setClientNotes} value={clientNotes} />
          </Grid>
        </TabPanel>
        <TabPanel header="Kontaktdaten">
          <Grid columns={2} gap={16}>
            <TextInputLabel label="Straße und Hausnummer" onChange={setStreet} value={street} />
            <Row gap={16}>
              <TextInputLabel label="PLZ" onChange={setPlz} value={plz} />
              <TextInputLabel label="Ort" onChange={setCity} value={city} />
            </Row>
            <Row alignItems="end" gap={8}>
              <TextInputLabel label="E-Mail" onChange={setEmail} value={email} />
              <SecondaryButton label="Ändern" onClick={() => setChanging(true)} size="small" />
            </Row>
            <TextInputLabel label="Telefon" onChange={setTelefon} value={telefon} />
          </Grid>
        </TabPanel>
        <TabPanel header="Aufgaben">
          <AufgabenTable staff={admins} user={user} />
        </TabPanel>
        <TabPanel header="Zertifikatsdatei">
          <div className="column width-100">
            <div className="row space-between width-100">
              <h3>Zertifikatsdateien</h3>
              <CertificateUploader user={user} />
            </div>
            <DividerBlock height={2} />
            <div className="grid columns-four gap-m">
              {certificates.map((c, i) => (
                <CertificateFile certificate={c} key={i} onDelete={refreshCertificates} />
              ))}
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Dokumente">
          <DocumentViewer user={user} />
        </TabPanel>
        <TabPanel header="Rechnungen">
          <InvoicesTableUser user={user} />
        </TabPanel>
        {isAdmin && (
          <TabPanel header="Abos">
            <SubscriptionEditor user={user} />
          </TabPanel>
        )}
      </TabView>
    </>
  );
}
