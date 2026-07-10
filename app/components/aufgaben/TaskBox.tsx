import { formatDate } from '@/app/utils/formats';
import Link from 'next/link';
import styles from './Tasks.module.css';
import { priority_options, task_status } from '@/app/constants/Constants';
import { Task, User } from '@/app/types/Database';
import { UserAvatarOther } from '../UserAvatar';
import Tag from '../ui/Tag';
import DividerBlock from '../DividerBlock';
import DividerLine from '../ui/DividerLine';

interface Props {
  admins: User[];
  task: Task;
}

export default function TaskBox({ admins, task }: Props) {
  const assignee = admins.find((t) => t.id === task.assignee);

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const status = task_status.find((t) => t.value === task.status);

  const priority = priority_options.find((p) => p.value === task.priority);

  return (
    <Link className={styles.taskBox} href={`/admin/aufgaben/${task.id}`}>
      <Tag
        bgColor={priority?.bg || 'var(--primary)'}
        color={priority?.color || 'white'}
        text={priority?.label || 'Status'}
      />
      <DividerBlock height={0.5} />
      <div className="row space-between">
        <span style={{ fontWeight: 600 }}>{task.title}</span>
      </div>
      <DividerBlock height={1} />
      <DividerLine />
      <DividerBlock height={1} />
      <div className="row space-between align-center">
        <div className="row gap-s align-center">
          <UserAvatarOther fontSize={11} height={32} user={assignee} width={32} />
          <span style={{ fontSize: 14 }}>{assignee?.user_name_first}</span>
        </div>
        {task.due_date && (
          <span style={{ color: isOverdue ? 'red' : 'black', fontSize: 14 }}>
            {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </Link>
  );
}
