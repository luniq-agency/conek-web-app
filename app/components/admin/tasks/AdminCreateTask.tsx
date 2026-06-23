'use client';

import { invoiceCreate } from '@/app/actions/invoice';
import { useAuth } from '@/app/context/AuthContext';
import { Client, User } from '@/app/types/Database';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { DatePicker, SelectLabel, TextAreaLabel, TextInputLabel } from '../../forms/FormElements';
import { adminLookUp } from '@/app/actions/admin';
import { taskCreate, taskUpdateCreate } from '@/app/actions/tasks';
import { notificationCreate } from '@/app/actions/notification';
import { usersLoadAll } from '@/app/actions/users';

export default function AdminCreateTask() {
  const { user, userProfile } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  // USERS
  const [users, setUsers] = useState<User[]>([]);

  const [selectedAdmin, setSelectedAdmin] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await usersLoadAll();
        setUsers(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  //INPUTS
  const [taskAssignee, setTaskAssignee] = useState<User | null>(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskUser, setTaskUser] = useState<User | null>(null);

  //ACTIONS
  const createTask = async () => {
    /* setSubmitting(true); */

    const recipient = await adminLookUp(selectedAdmin);

    const notificationPayload = {
      message: `${userProfile?.user_name_first} ${userProfile?.user_name_last} hat die Aufgabe '${taskName}' erstellt und dir zugewiesen.`,
      read: false,
      recipient: recipient.id,
      title: 'Neue Aufgabe',
    };

    const taskPayload = {
      assignee: recipient.id,
      created_at: new Date(),
      created_by: userProfile?.id,
      description: taskDescription,
      due_date: taskDueDate || null,
      status: 'open',
      title: taskName,
    };
    console.log('Task:', taskPayload);
    console.log('Notification:', notificationPayload);
    
    try {
      const taskRes = await taskCreate(taskPayload);

      const taskUpdatePayload = {
        body: `${userProfile?.user_name_first} ${userProfile?.user_name_last} hat den Task erstellt.`,
        created_by: userProfile?.id,
        creator: `${userProfile?.user_name_first} ${userProfile?.user_name_last}`,
        image: userProfile?.avatar || null,
        task: taskRes.id,
      };

      await taskUpdateCreate(taskUpdatePayload);
      if (recipient.id !== user?.id)
        await notificationCreate(notificationPayload, recipient);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
    setVisible(false);
    setTaskAssignee(null);
    setTaskDescription('');
    setTaskName('');
    router.refresh();
  
  };

  const adminOptions = users
    .filter((a) => a.user_role === 'admin')
    .map((a) => ({
      ...a,
      fullName: `${a.user_name_last}, ${a.user_name_first}`,
    }))
    .sort((a: User, b: User) => a.user_name_last.localeCompare(b.user_name_last));

  const clientOptions = users
    .filter((a) => a.user_role === 'client')
    .map((a) => ({
      ...a,
      fullName: `${a.user_name_last}, ${a.user_name_first}`,
    }))
    .sort((a: User, b: User) => a.user_name_last.localeCompare(b.user_name_last));

  return (
    <>
      <Dialog
        closable={true}
        draggable={false}
        header="Neue Aufgabe"
        onHide={() => setVisible(false)}
        style={{ maxWidth: 480, width: '100%' }}
        visible={visible}
      >
        <div className="column gap-m">
          <TextInputLabel label="Name der Aufgabe" onChange={setTaskName} value={taskName} />
          <SelectLabel
            label="Bearbeiter"
            onChange={(value) => setSelectedAdmin(value)}
            optionLabel="fullName"
            optionValue="id"
            options={adminOptions}
            value={selectedAdmin}
          />
          <div className="column gap-xs">
            <label>Verknüpfter Kunde (optional)</label>
            <Dropdown
              filter
              filterPlaceholder="Suchen"
              onChange={(e) => setTaskUser(e.value)}
              optionLabel="fullName"
              optionValue="id"
              options={clientOptions}
              value={taskUser}
            />
          </div>
          <DatePicker
            dateValue={taskDueDate || new Date()}
            label="Fälligkeitsdatum"
            onDateChange={setTaskDueDate}
          />
          <TextAreaLabel
            label="Beschreibung"
            onChange={setTaskDescription}
            value={taskDescription}
          />
          <Button
            className="button-primary"
            disabled={!selectedAdmin || !taskDescription || !taskName || submitting}
            icon={submitting ? 'pi pi-spinner' : undefined}
            label="Aufgabe erstellen"
            onClick={createTask}
            style={{ width: 'fit-content' }}
          />
        </div>
      </Dialog>
      <Button
        className="button-primary"
        icon="pi pi-plus"
        label="Aufgabe erstellen"
        onClick={() => setVisible(true)}
      />
    </>
  );
}
