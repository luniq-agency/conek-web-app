import { adminsLoadAll } from '@/app/actions/admin';
import { tasksLoadAll } from '@/app/actions/tasks';
import AdminCreateTask from '@/app/components/admin/tasks/AdminCreateTask';
import TaskTable from '@/app/components/aufgaben/TaskTable';
import DividerBlock from '@/app/components/DividerBlock';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aufgaben | CONEK',
  description: '',
};

export default async function AdminTasksPage() {
  const admins = await adminsLoadAll();
  const tasks = await tasksLoadAll();

  return (
    <div className="page-content">
      <div className="row space-between">
        <h1>Aufgaben</h1>
        <AdminCreateTask />
      </div>
      <DividerBlock height={2} />
      <TaskTable admins={admins} tasks={tasks} />
    </div>
  );
}
