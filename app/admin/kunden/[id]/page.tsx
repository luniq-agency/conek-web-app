import { BreadCrumb } from 'primereact/breadcrumb';
import { Metadata } from 'next';
import DividerBlock from '@/app/components/DividerBlock';
import ClientTabs from '@/app/components/clients/ClientTabs';
import { formatDate } from '@/app/utils/formats';
import { UserAvatarOther } from '@/app/components/UserAvatar';
import { userLookup } from '@/app/actions/users';
import { job_categories } from '@/app/constants/Constants';
import ClientActions from '@/app/components/clients/ClientActions';

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

  const job = job_categories.find((t) => t.value === user.job_status);

  if (!user) return;

  return (
    <div className="page-content column">
      <BreadCrumb home={home} model={items} />
      <DividerBlock height={2} />
      <div className="row space-between">
        <div className="row gap-m">
          <div style={{ width: 72 }}>
            <UserAvatarOther
              backgroundColor={job?.bg}
              color={job?.color}
              fontSize={32}
              height={72}
              user={user}
              width={72}
            />
          </div>
          <div className="column width-100">
            <h1>
              {user.user_name_last}, {user.user_name_first}
            </h1>
            <span>Angemeldet seit: {formatDate(user.created_at)}</span>
          </div>
        </div>
        <ClientActions client={user} />
      </div>
      <DividerBlock height={2} />
      <div className="dashboard-container flex-grow">
        <ClientTabs user={user} />
      </div>
    </div>
  );
}
