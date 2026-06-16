'use client';

import { User } from '@/app/types/Database';
import { PasswordInputIconAuth, TextInputIconAuth } from '../../forms/FormElements';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { adminCompleteAccount } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { agencySignup } from '@/app/actions/agency';
import { InputText } from 'primereact/inputtext';

interface Props {
  email?: string;
  role: string;
  user: User;
}

export default function AdminSignupForm({ email, role, user }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  useEffect(() => {
    console.log('User:', user);
  });

  const createAccount = async (e: React.FormEvent) => {
    if (!role) console.error('Keine Rolle ausgewählt!');
    e.preventDefault();
    setSubmitting(true);
    if (role === 'admin')
      try {
        await adminCompleteAccount(user.email, password, user.user_role);
        redirect('/admin');
      } catch (err) {
        console.error(err);
      }
    else
      try {
        if (!email) return;
        await agencySignup(email, user.id, password);
      } catch (err) {
        console.error(err);
      }
  };

  return (
    <form onSubmit={createAccount}>
      <div className="column gap-s">
        <InputText value={user.email} />
        <PasswordInputIconAuth
          autoComplete="new-password"
          icon="pi pi-lock"
          onChange={setPassword}
          placeholder="Passwort"
          value={password}
        />
        <PasswordInputIconAuth
          autoComplete="new-password"
          icon="pi pi-lock"
          onChange={setPasswordRepeat}
          placeholder="Passwort wiederholen"
          value={passwordRepeat}
        />
        <Button
          disabled={!password || !passwordRepeat}
          icon={submitting ? 'pi pi-spinner' : undefined}
          label="Konto erstellen"
          onClick={createAccount}
        />
      </div>
    </form>
  );
}
