import { adminsLoadAll } from '@/app/actions/admin';
import { tasksLoadAll } from '@/app/actions/tasks';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCreateTask from '@/app/components/admin/tasks/AdminCreateTask';
import TaskKanban from '@/app/components/aufgaben/TaskKanban';
import TaskTable from '@/app/components/aufgaben/TaskTable';
import DividerBlock from '@/app/components/DividerBlock';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aufgaben | CONEK',
  description: '',
};

export default async function AdminTasksPage() {
  const admins = await adminsLoadAll();

  return (
    <div className="page-content" style={{ padding: 0 }}>
      <AdminPageHeader>
        <div className="row space-between">
          <h1>Aufgaben</h1>
          <AdminCreateTask />
        </div>
      </AdminPageHeader>
      <div className="content-alt" style={{ flexGrow: 1, padding: '1.5rem' }}>
        <TaskKanban admins={admins} />
      </div>
    </div>
  );
}
