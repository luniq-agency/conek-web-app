'use client';

import styles from './Tasks.module.css';
import { Task, User } from '@/app/types/Database';
import { TaskColumn } from './TaskColumn';
import { useEffect, useState } from 'react';
import { tasksLoadAll } from '@/app/actions/tasks';
import { useAuth } from '@/app/context/AuthContext';

interface Props {
  admins: User[];
}

export default function TaskKanban({ admins }: Props) {
  const { userProfile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!userProfile) return;
    const fetchData = async () => {
      try {
        const res = await tasksLoadAll(userProfile?.user_role, userProfile?.id);
        setTasks(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userProfile]);

  const completed = tasks.filter((t) => t.status === 'closed');
  const onHold = tasks.filter((t) => t.status === 'on_hold');
  const open = tasks.filter((t) => t.status === 'open');
  const overdue = tasks.filter((t) => t.status === 'overdue');

  return (
    <div className={styles.taskGrid}>
      <TaskColumn
        admins={admins}
        color="var(--primary)"
        header="In Bearbeitung"
        tasks={open}
      />
      <TaskColumn
        admins={admins}
        color="var(--error-text)"
        header="Überfällig"
        tasks={overdue}
      />
      <TaskColumn
        admins={admins}
        color="var(--warning-text)"
        header="Wiedervorlage"
        tasks={onHold}
      />
    </div>
  );
}
