'use client';

import TaskBox from './TaskBox';
import DividerBlock from '../DividerBlock';
import styles from './Tasks.module.css';
import { Task, User } from '@/app/types/Database';
import { HeaderButton } from '../buttons/Buttons';
import { Plus } from 'lucide-react';

interface Props {
  admins: User[];
  color: string;
  header: string;
  tasks?: Task[];
}

export function TaskColumn({ admins, color, header, tasks }: Props) {
  return (
    <div className={styles.taskColumn}>
      <div className={styles.taskHeader} style={{ borderColor: color }}>
        <div className="row align-center gap-xs grow">
          <h3 className={styles.taskLabel}>{header}</h3>
          <span className={styles.taskCounter}>{tasks?.length || 0}</span>
        </div>
      </div>
      <DividerBlock height={2} />
      {tasks && tasks.map((t, i) => <TaskBox admins={admins} key={i} task={t} />)}
    </div>
  );
}
