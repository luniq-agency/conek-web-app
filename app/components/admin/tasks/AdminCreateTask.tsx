'use client';

import { invoiceCreate } from '@/app/actions/invoice';
import { useAuth } from '@/app/context/AuthContext';
import { Client, User } from '@/app/types/Database';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { DatePicker, SelectLabel, TextAreaLabel, TextInputLabel } from '../../forms/FormElements';
import { adminLookUp } from '@/app/actions/admin';
import { taskCreate, taskUpdateCreate } from '@/app/actions/tasks';
import { notificationCreate } from '@/app/actions/notification';

interface Props {
  admins: User[];
}
export default function AdminCreateTask({ admins }: Props) {
  const { user, userProfile } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  const [selectedAdmin, setSelectedAdmin] = useState('');

  const adminOptions = admins.map((a) => ({
    ...a,
    fullName: `${a.user_name_last}, ${a.user_name_first}`,
  }));

  //INPUTS
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [taskName, setTaskName] = useState('');

  //ACTIONS
  const createTask = async () => {
    setSubmitting(true);

    const recipient = await adminLookUp(selectedAdmin);

    const notificationPayload = {
      message: `${userProfile?.user_name_first} ${userProfile?.user_name_last} hat die Aufgabe ${taskName} erstellt und dir zugewiesen.`,
      read: false,
      recipient: recipient.user_uuid,
      title: 'Neue Aufgabe',
    };

    const taskPayload = {
      assignee: recipient.user_uuid,
      created_at: new Date(),
      created_by: user?.id,
      description: taskDescription,
      due_date: taskDueDate,
      status: 'open',
      title: taskName,
    };
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
      if (recipient.user_uuid !== user?.id)
        await notificationCreate(notificationPayload, recipient);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
    setVisible(false);
    setTaskAssignee('');
    setTaskDescription('');
    setTaskName('');
    router.refresh();
  };

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
            disabled={!selectedAdmin || !taskDescription || !taskName}
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
