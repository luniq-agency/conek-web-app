'use client';

import styles from '@/app/components/admin/Admin.module.css';
import DividerBlock from '../../DividerBlock';
import Link from 'next/link';
import Loader from '../../Loader';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { TaskTableSmall } from '../../aufgaben/TaskTable';
import StatCard from '../../admin/StatCard';
import { Task, User } from '@/app/types/Database';
import { adminsLoadAll } from '@/app/actions/admin';
import { clientsLoadAll } from '@/app/actions/clients';
import { Registration, registrationsLoadMonthly } from '@/app/actions/stats';
import { tasksLoadOpen } from '@/app/actions/tasks';
import { useProfilePolling } from '@/app/hooks/useProfilePolling';
import { ClientTableSmall } from '../../clients/ClientTableSmall';

export default function AdminDashboard() {
  const mounted = useRef(false);
  const { user, userProfile } = useAuth();
  useProfilePolling(user, userProfile);

  // DATA
  const [admins, setAdmins] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // INIT
  useEffect(() => {
    if (!userProfile || mounted.current) return;

    mounted.current = true;

    const fetchData = async () => {
      try {
        const [adminRes, clientRes, registerRes, taskRes] = await Promise.all([
          adminsLoadAll(),
          clientsLoadAll(userProfile.user_role, userProfile.id),
          registrationsLoadMonthly(),
          tasksLoadOpen(),
        ]);
        console.log('Kunden:', clientRes);
        setAdmins(adminRes);
        setClients(clientRes);
        setRegistrations(registerRes);
        setTasks(taskRes);
      } catch (err) {}
    };
    fetchData();
  }, [userProfile]);

  const currentMonthRegistrations = registrations.filter((r) => {
    const month = new Date(r.month);
    const now = new Date();
    return month.getMonth() === now.getMonth() && month.getFullYear() === now.getFullYear();
  });

  const openTasks = tasks.filter((t) => t.status === 'open');

  if (!user || !userProfile) return <Loader text="Dein Profil wird eingerichtet" />;

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
          disclaimer="vs. letzter Monat"
          header="Anmeldungen"
          registrationData={registrations}
          value={currentMonthRegistrations[0]?.count ?? 0}
        />
      </div>
      <DividerBlock height={1} />
      <div className="row gap-m mobile-column grow">
        <div className="container">
          <div className="row space-between align-center">
            <h2 className="container-header">Offene Aufgaben</h2>
            <Link className="container-link" href="/admin/aufgaben">
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
          <ClientTableSmall clients={clients} />
        </div>
      </div>
    </div>
  );
}
