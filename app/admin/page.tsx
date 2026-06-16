'use server';

import Link from 'next/link';
import styles from '../components/admin/Admin.module.css';
import DividerBlock from '../components/DividerBlock';
import StatCard from '../components/admin/StatCard';
import { clientsLoadAll } from '../actions/clients';
import { ClientTableLatest } from '../components/admin/clients/ClientTable';
import { TaskTableSmall } from '../components/admin/tasks/TaskTable';
import { adminsLoadAll } from '../actions/admin';
import { tasksLoadAll } from '../actions/tasks';
import { registrationsLoadMonthly } from '../actions/stats';

export default async function AdminDashboardPage() {
  const admins = await adminsLoadAll();
  const clients = await clientsLoadAll();
  const registrations = await registrationsLoadMonthly();
  const tasks = await tasksLoadAll();

  //STATS
  const currentMonthRegistrations = registrations.filter((r) => {
    const month = new Date(r.month);
    const now = new Date();
    return month.getMonth() === now.getMonth() && month.getFullYear() === now.getFullYear();
  });

  const openTasks = tasks.filter((t) => t.status === 'open');

  return (
    <div className="page-content">
      <h1 className={styles.h1}>Dashboard</h1>
      <DividerBlock height={1} />
      <div className="row gap-m mobile-column">
        <StatCard
          chart={false}
          disclaimer="vs. letzter Monat"
          header="Offene Aufgaben"
          value={openTasks.length}
        />
        <StatCard
          chart={true}
          disclaimer="vs. letzter Monat"
          header="Anmeldungen"
          registrationData={registrations}
          value={currentMonthRegistrations[0]?.count ?? 0}
        />
      </div>
      <DividerBlock height={1} />
      <div className="row gap-m mobile-column">
        <div className="container">
          <div className="row space-between align-center">
            <h2 className="container-header">Offene Aufgaben</h2>
            <Link className="container-link" href="/admin/kunden">
              Alle ansehen
            </Link>
          </div>
          <DividerBlock height={1} />
          <TaskTableSmall admins={admins} tasks={tasks} />
        </div>
        <div className="container">
          <div className="row space-between align-center">
            <h2 className="container-header">Letzte Anmeldungen</h2>
            <Link className="container-link" href="/admin/kunden">
              Alle ansehen
            </Link>
          </div>
          <DividerBlock height={1} />
          <ClientTableLatest />
        </div>
      </div>
    </div>
  );
}
