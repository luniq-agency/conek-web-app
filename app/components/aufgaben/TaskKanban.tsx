'use client';

import styles from './Tasks.module.css';
import { Task, User } from '@/app/types/Database';
import { TaskColumn } from './TaskColumn';
import { useEffect, useState } from 'react';
import { tasksLoadAll } from '@/app/actions/tasks';
import { useAuth } from '@/app/context/AuthContext';

interface Props {
  admins: User[];
  tasks: Task[];
}

export default function TaskKanban({ admins, tasks }: Props) {
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
