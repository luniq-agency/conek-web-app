'use client';

import DividerBlock from '@/app/components/DividerBlock';
import LinkBlock from '@/app/components/cards/LinkBlock';
import { useAuth } from '@/app/context/AuthContext';
import Loader from '@/app/components/Loader';

export default function Dashboard() {
  const { user, userProfile, loading } = useAuth();

  if (!user || !userProfile) return <Loader />;

  return (
    <div className="content-wrapper" style={{padding: 16}}>
      <div className="row gap-m">
        <h1>Hallo, {userProfile?.user_name_first}!</h1>
      </div>
      <DividerBlock height={2} />
      <div className="grid columns-two gap-s">
        <LinkBlock
          background="var(--primary)"
          body="Verwalte deine Dokumente"
          headline="Meine Dokumente"
          target="/dashboard/dokumente"
          textColor="white"
        />
        <LinkBlock
          background="var(--secondary)"
          body="Du hast Fragen? Wir sind für dich da"
          headline="Hilfe & Support"
          target="/dashboard/tickets"
          textColor="var(--text-primary)"
        />
      </div>
    </div>
  );
}
