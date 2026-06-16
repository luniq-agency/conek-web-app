import { adminsLoadAll } from '@/app/actions/admin';
import { emailTemplatesLoad } from '@/app/actions/emailtemplates';
import { tasksLoadAll } from '@/app/actions/tasks';
import AdminTemplateCreate from '@/app/components/admin/emails/AdminTemplateCreate';
import EmailTemplatesTable from '@/app/components/admin/emails/EmailTemplatesTable';
import AdminCreateTask from '@/app/components/admin/tasks/AdminCreateTask';
import TaskTable from '@/app/components/admin/tasks/TaskTable';
import DividerBlock from '@/app/components/DividerBlock';
import UserSettings from '@/app/components/UserSettings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Mail-Vorlagen | CONEK',
  description: '',
};

export default async function AdminTasksPage() {
  const templates = await emailTemplatesLoad();

  return (
    <div className="page-content">
      <div className="row space-between">
        <h1>E-Mail-Vorlagen</h1>
        <AdminTemplateCreate />
      </div>
      <DividerBlock height={2} />
      <div className="container">
        <EmailTemplatesTable templates={templates} />
      </div>
    </div>
  );
}
