import { taskCreate, tasksLoadUser } from '@/app/actions/tasks';
import { Task, User } from '@/app/types/Database';
import { formatDate } from '@/app/utils/formats';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { useEffect, useRef, useState } from 'react';
import { SelectLabel, TextAreaLabel, TextInputLabel } from '../forms/FormElements';
import LayoutColumn from '../layout/Column';
import Row from '../layout/Row';
import UserSelector from '../forms/UserSelector';
import { filterAdmins } from '@/app/actions/users/filter';
import { DatePicker } from '../forms/datepicker/DatePicker';
import { Toast } from 'primereact/toast';
import { task_status } from '@/app/constants/Constants';
import Tag from '../ui/Tag';
import { UserAvatarOther } from '../UserAvatar';

interface Props {
  staff: User[];
  user: User;
}

export default function AufgabenTable({ staff, user }: Props) {
  const toast = useRef<Toast | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);

  // STATES
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const res = await tasksLoadUser(user.id);
      setTasks(res);
    };
    fetchData();
  }, [user]);

  // INPUTS
  const [taskAssignee, setTaskAssignee] = useState<User | null>(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [taskName, setTaskName] = useState('');

  // FILTERS
  const admins = filterAdmins(staff);
  const agents = staff.filter((s) => s.user_role === 'agency');

  // TEMPLATES
  const assigneeTemplate = (rowData: Task) => {
    const assignee = admins.find((a) => a.id === rowData.assignee);
    if (!rowData.assignee) return <span>–</span>;

    return (
      <Row alignItems="center" gap={4}>
        <UserAvatarOther fontSize={12} height={24} user={assignee} width={24} />
        <span>
          {assignee?.user_name_first} {assignee?.user_name_last}
        </span>
      </Row>
    );
  };

  const dueDateTemplate = (rowData: Task) => {
    if (!rowData.due_date) return <span>–</span>;
    const overdue = rowData.due_date >= new Date();

    return <span style={{ color: overdue ? 'red' : 'black' }}>{formatDate(rowData.due_date)}</span>;
  };

  const statusTemplate = (rowData: Task) => {
    const status = task_status.find((t) => t.value === rowData.status);
    if (!status) return;
    return <Tag bgColor={status?.bg} color={status?.color} text={status?.label} />;
  };

  // ACTIONS
  const createTask = async () => {
    const taskPayload = {
      assignee: taskAssignee ? taskAssignee.id : null,
      description: taskDescription,
      due_date: taskDueDate,
      status: 'open',
      title: taskName,
      user: user.id,
    };

    try {
      await taskCreate(taskPayload);
      refresh();
      toast.current?.show({
        severity: 'success',
        summary: 'Aufgabe erstellt',
        detail: 'Die Aufgabe wurde erfolgreich erstellt.',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
      setTaskAssignee(null);
      setTaskDescription('');
      setTaskDueDate(null);
      setTaskName('');
    }
  };

  const refresh = async () => {
    const res = await tasksLoadUser(user.id);
    setTasks(res);
  };

  return (
    <LayoutColumn>
      <Toast ref={toast} />
      <Dialog
        draggable={false}
        header="Task erstellen"
        onHide={() => setCreating(false)}
        style={{ maxWidth: 400, width: '100%' }}
        visible={creating}
      >
        <div className="column gap-m">
          <TextInputLabel label="Name des Tasks" onChange={setTaskName} value={taskName} />
          <TextAreaLabel
            label="Beschreibung"
            onChange={setTaskDescription}
            value={taskDescription}
          />
          <DatePicker label="Fälligkeitsdatum" onChange={setTaskDueDate} value={taskDueDate} />
          <UserSelector
            label="Bearbeiter (optional)"
            onChange={setTaskAssignee}
            optionLabel="fullName"
            options={admins}
            value={taskAssignee}
          />
          <Button disabled={!taskName} label="Task erstellen" onClick={createTask} />
        </div>
      </Dialog>
      <Row justifyContent="space-between">
        <h3>Aufgaben</h3>
        <Button
          className="button-secondary"
          label="Aufgabe erstellen"
          onClick={() => setCreating(true)}
        />
      </Row>
      <DataTable emptyMessage="Keine Aufgaben gefunden" value={tasks}>
        <Column field="title" header="Name" />
        <Column body={assigneeTemplate} header="Bearbeiter" />
        <Column body={statusTemplate} header="Status" />
        <Column body={dueDateTemplate} header="Fällig bis" />
      </DataTable>
    </LayoutColumn>
  );
}
