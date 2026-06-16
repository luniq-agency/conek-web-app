'use client';

import { useAuth } from '@/app/context/AuthContext';
import Loader from '../components/Loader';
import DividerBlock from '../components/DividerBlock';
import LinkBlock from '../components/cards/LinkBlock';

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();

  if (!user || !userProfile) return <Loader />;

  return (
    <div className="content-wrapper">
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
          body=""
          headline="Hilfe & Support"
          target="/dashboard/tickets"
          textColor="var(--text-primary)"
        />
      </div>
    </div>
  );
}
