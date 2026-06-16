'use client';

import { taskClose, taskUpdateCreate, taskUpdatesLoad } from '@/app/actions/tasks';
import { Task, TaskUpdate, User } from '@/app/types/Database';
import { Timeline } from 'primereact/timeline';
import { useEffect, useState } from 'react';
import { UserAvatar } from '../../UserAvatar';
import { userLookup, userLookupWithId, usersLoadAgentsAdmins } from '@/app/actions/users';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from 'primereact/button';
import DividerBlock from '../../DividerBlock';
import { formatDateWithTime } from '@/app/utils/formats';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

const updateOptions = [
  {
    label: 'Ticket schließen',
    value: 'close',
  },
  { label: 'Ticket übertragen', value: 'transfer' },
  {
    label: 'Update schreiben',
    value: 'update',
  },
];

interface Props {
  task: Task;
}

export default function TaskEditor({ task }: Props) {
  const { user, userProfile } = useAuth();
  const [updates, setUpdates] = useState<TaskUpdate[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});

  const [creator, setCreator] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  //INPUTS
  const [updateTarget, setUpdateTarget] = useState<User | null>(null);
  const [updateText, setUpdateText] = useState('');
  const [updateType, setUpdateType] = useState('');

  const customMarker = (item: TaskUpdate) => {
    const user = userMap[item.created_by];
    return <UserAvatar fontSize={16} height={32} user={user} width={32} />;
  };

  const customContent = (item: TaskUpdate) => {
    return (
      <div className="column">
        <div className="row space-between">
          <span style={{ fontSize: 14, fontWeight: 700 }}>{item.creator}</span>
          <span className="text-meta">{formatDateWithTime(item.created_at)}</span>
        </div>
        <span className="text-s">{item.body}</span>
      </div>
    );
  };

  const fetchUpdates = async () => {
    try {
      const res = await taskUpdatesLoad(task.id);
      const creatorRes = await userLookupWithId(task.created_by);
      const adminRes = await usersLoadAgentsAdmins();
      console.log(adminRes);
      setCreator(creatorRes);
      setUpdates(res);
      setUsers(adminRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!task) return;
    fetchUpdates();
  }, [task]);

  useEffect(() => {
    if (!updates.length) return;

    const fetchUsers = async () => {
      const entries = await Promise.all(
        updates.map(async (u) => {
          const user = await userLookup(u.created_by);
          return [u.created_by, user] as [string, User];
        })
      );
      setUserMap(Object.fromEntries(entries));
    };

    fetchUsers();
  }, [updates]);

  const createUpdate = async () => {
    if (!updateType) return;

    let body = updateText;
    if (updateType === 'close') body = 'Das Ticket wurde geschlossen.';
    if (updateType === 'transfer')
      body = `Das Ticket wurde an ${updateTarget?.user_name_first} ${updateTarget?.user_name_last} übertragen.`;
    setSubmitting(true);

    const payload = {
      body: body || updateText,
      created_at: new Date(),
      created_by: userProfile?.id,
      creator: `${userProfile?.user_name_first} ${userProfile?.user_name_last}`,
      task: task.id,
    };

    try {
      await taskUpdateCreate(payload);
      if (updateType === 'close') await taskClose(task.id);
      fetchUpdates();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateTarget(null);
      setUpdateText('');
      setUpdateType('');
      setSubmitting(false);
    }
  };

  const userOptions = users
    .map((u) => ({
      ...u,
      fullName: `${u.user_name_last}, ${u.user_name_first}`,
    }))
    .sort((a, b) => a.user_name_last.localeCompare(b.user_name_last));

  return (
    <div className="row gap-m width-100">
      <div className="container column gap-l">
        <h3>{task.title}</h3>
        <div className="column">
          <label>Beschreibung</label>
          <span>{task.description}</span>
        </div>
        <div className="column">
          <label>Erstellt von</label>
          <div className="row align-center gap-s">
            {creator && <UserAvatar fontSize={12} height={24} user={creator} width={24} />}
            <span>
              {creator?.user_name_first} {creator?.user_name_last}
            </span>
          </div>
        </div>
        <div className="column">
          <label>Erstellt am</label>
          <span>{formatDateWithTime(task.created_at)}</span>
        </div>
        <div className="column gap-s">
          <label>Update</label>
          <Dropdown
            onChange={(e) => setUpdateType(e.value)}
            optionLabel="label"
            optionValue="value"
            options={updateOptions}
            value={updateType}
          />
          {updateType === 'update' && (
            <InputTextarea
              onChange={(e) => setUpdateText(e.target.value)}
              rows={5}
              value={updateText}
            />
          )}
          {updateType === 'transfer' && (
            <Dropdown
              filter
              filterPlaceholder="Suchen"
              onChange={(e) => setUpdateTarget(e.value)}
              optionLabel="fullName"
              optionValue="id"
              options={userOptions}
              value={updateTarget}
            />
          )}
          <Button
            disabled={!updateType || submitting}
            icon={submitting ? 'pi pi-spinner' : undefined}
            label="Speichern"
            onClick={createUpdate}
          />
        </div>
      </div>
      <div className="container">
        <h3>Verlauf</h3>
        <DividerBlock height={1} />
        <Timeline align="left" content={customContent} marker={customMarker} value={updates} />
      </div>
    </div>
  );
}
