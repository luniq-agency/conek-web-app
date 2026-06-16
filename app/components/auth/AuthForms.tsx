'use client';

import { Button } from 'primereact/button';
import { clientSignup } from '@/app/actions/clients';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useEffect, useState } from 'react';
import { getEmails, login } from '@/app/actions/auth';
import Link from 'next/link';
import { PasswordInputIconAuth, TextInputIconAuth } from '../forms/FormElements';
import { useRouter } from 'next/navigation';
import { registerBubbleUser } from '@/app/actions/migrate';

export function ClientSignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password !== passwordConfirm;

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await clientSignup(email, password);
      router.push('/onboarding');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="column gap-l">
      <form onSubmit={signup}>
        <div className="column gap-s">
          <TextInputIconAuth
            icon="pi pi-envelope"
            onChange={setEmail}
            placeholder="E-Mail-Adresse"
            value={email}
          />
          <PasswordInputIconAuth
            autoComplete="new-password"
            icon="pi pi-lock"
            placeholder="Passwort"
            onChange={setPassword}
            value={password}
          />
          <PasswordInputIconAuth
            autoComplete="new-password"
            icon="pi pi-lock"
            placeholder="Passwort wiederholen"
            onChange={setPasswordConfirm}
            value={passwordConfirm}
          />

          <Button
            className="button-auth"
            disabled={!email || !password || !passwordConfirm || passwordsMatch || submitting}
            icon={submitting ? 'pi pi-spinner' : undefined}
            label="Konto erstellen"
            onClick={signup}
          />
        </div>
      </form>
      <div className="column gap-m">
        <span style={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
          Du hast schon ein Konto?
        </span>
        <Link href="/" style={{ width: '100%' }}>
          <Button className="button-secondary" label="Jetzt Anmelden" style={{ width: '100%' }} />
        </Link>
      </div>
    </div>
  );
}

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError('Keinen Benutzer mit diesen Daten gefunden.');
      setSubmitting(false);
    }
  };

  return (
    <div className="column gap-l">
      <form onSubmit={signIn}>
        <div className="column gap-m">
          <InputText
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail"
            value={email}
          />
          <div className="column gap-xs">
            <Password
              autoComplete="current-password"
              feedback={false}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              value={password}
            />
            <Button
              className="container-link"
              label="Passwort vergessen?"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                marginLeft: 'auto',
                padding: 0,
                width: 'fit-content',
              }}
            />
          </div>
          <Button
            className="button-auth"
            disabled={!email || !password || submitting}
            icon={submitting ? 'pi pi-spinner' : undefined}
            label="Anmelden"
            onClick={signIn}
          />
          {error && <span style={{ color: 'pink', textAlign: 'center' }}>{error}</span>}
        </div>
      </form>
      <div className="column gap-m">
        <span style={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
          Noch kein Konto?
        </span>
        <Link href="/registrieren" style={{ width: '100%' }}>
          <Button
            className="button-secondary"
            label="Jetzt registrieren"
            style={{ width: '100%' }}
          />
        </Link>
      </div>
    </div>
  );
}

export function SignInMigrateForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailList, setEmailList] = useState<string[]>([]);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  const fetchEmails = async () => {
    try {
      const res = await getEmails();
      setEmailList(res);
      console.log("Emails:", res)
    } catch (err) {
      console.error(err);
    }
  };
  fetchEmails(); // ← fehlte
}, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (emailList.includes(email)) {
      await registerBubbleUser(email, password);
      } else {
      await login(email, password);
      }

    } catch (err) {
      console.error(err);
      setError('Keinen Benutzer mit diesen Daten gefunden.');
      setSubmitting(false);
    }
  };

  return (
    <div className="column gap-l">
      <form onSubmit={signIn}>
        <div className="column gap-m">
          <InputText
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail"
            value={email}
          />
          <div className="column gap-xs">
            <Password
              autoComplete="current-password"
              feedback={false}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              value={password}
            />
            <Button
              className="container-link"
              label="Passwort vergessen?"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                marginLeft: 'auto',
                padding: 0,
                width: 'fit-content',
              }}
            />
          </div>
          <Button
            className="button-auth"
            disabled={!email || !password || submitting}
            icon={submitting ? 'pi pi-spinner' : undefined}
            label="Anmelden"
            onClick={signIn}
          />
          {error && <span style={{ color: 'pink', textAlign: 'center' }}>{error}</span>}
        </div>
      </form>
      <div className="column gap-m">
        <span style={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
          Noch kein Konto?
        </span>
        <Link href="/registrieren" style={{ width: '100%' }}>
          <Button
            className="button-secondary"
            label="Jetzt registrieren"
            style={{ width: '100%' }}
          />
        </Link>
      </div>
    </div>
  );
}
