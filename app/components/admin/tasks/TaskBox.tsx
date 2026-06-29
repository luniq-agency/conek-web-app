import { Task, User } from '@/app/types/Database';
import Link from 'next/link';
import { UserAvatarOther } from '../../UserAvatar';
import { formatDate } from '@/app/utils/formats';
import { task_status } from '@/app/constants/Constants';
import { Tag } from 'primereact/tag';

interface Props {
  admins: User[];
  task: Task;
}

export default function TaskBox({ admins, task }: Props) {
  const assignee = admins.find((t) => t.id === task.assignee);

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const status = task_status.find((t) => t.value === task.status);

  return (
    <Link href={`/admin/aufgaben/${task.id}`}>
      <div className="container column gap-m">
        <div className="row space-between">
          <span style={{ fontWeight: 600 }}>{task.title}</span>
          {status && (
            <Tag
              style={{ backgroundColor: status.bg, color: status.color }}
              value={status?.label}
            />
          )}
        </div>
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
      </div>
    </Link>
  );
}
