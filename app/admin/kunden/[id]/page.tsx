import { BreadCrumb } from 'primereact/breadcrumb';
import { Metadata } from 'next';
import DividerBlock from '@/app/components/DividerBlock';
import { clientLoadSingle, clientLookup } from '@/app/actions/clients';
import ClientActions from '@/app/components/admin/clients/ClientActions';
import { userUpdatesLoad } from '@/app/actions/update';
import ClientTabs from '@/app/components/admin/clients/ClientTabs';
import { formatDate } from '@/app/utils/formats';
import { UserAvatarOther } from '@/app/components/UserAvatar';
import { userLookup } from '@/app/actions/users';

export const metadata: Metadata = {
  title: 'Kundenprofil | CONEK',
  description: '',
};

export default async function AdminClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await userLookup(id);

  const items = [
    {
      label: 'Kunden',
      url: '/admin/kunden',
    },
    {
      label: `${user.user_name_last}, ${user.user_name_first}`,
    },
  ];

  const home = { icon: 'pi pi-home', url: '/admin' };

  if (!user) return;

  return (
    <div className="page-content column">
      <BreadCrumb home={home} model={items} />
      <DividerBlock height={2} />
      <div className="row gap-m">
        <div style={{ width: 72 }}>
          <UserAvatarOther fontSize={32} height={72} user={user} width={72} />
        </div>
        <div className="column width-100">
          <h1>
            {user.user_name_last}, {user.user_name_first}
          </h1>
          <span>Angemeldet seit: {formatDate(user.created_at)}</span>
        </div>
      </div>
      <DividerBlock height={2} />
      <div className="dashboard-container flex-grow">
        <ClientTabs user={user} />
      </div>
    </div>
  );
}
