import DividerBlock from '../DividerBlock';
import { TaskColumn } from './TaskColumn';
import styles from './Tasks.module.css';
import { Task, User } from '@/app/types/Database';

interface Props {
  admins: User[];
  tasks: Task[];
}

export default function TaskKanban({ admins, tasks }: Props) {
  const completed = tasks.filter((t) => t.status === 'closed');
  const onHold = tasks.filter((t) => t.status === 'on_hold');
  const open = tasks.filter((t) => t.status === 'open');
  const overdue = tasks.filter((t) => t.status === 'overdue');

  return (
    <div className={styles.taskGrid}>
      <TaskColumn admins={admins} color="var(--primary)" header="In Bearbeitung" tasks={open} />
      <TaskColumn admins={admins} color="var(--error-text)" header="Überfällig" tasks={overdue} />
      <TaskColumn admins={admins} color="var(--warning-text)" header="Wiedervorlage" tasks={onHold} />
    </div>
  );
}
