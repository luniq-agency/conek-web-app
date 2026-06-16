import { Task } from '@/app/types/Database';

interface Props {
  task: Task;
}

export default function TaskBox({ task }: Props) {
  return <div className="container">{task.title}</div>;
}
