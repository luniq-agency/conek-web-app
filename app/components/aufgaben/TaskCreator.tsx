'use client';

import { User } from '@/app/types/Database';
import { useState } from 'react';
import { SelectLabel, TextInputLabel } from '../forms/FormElements';

export default function TaskCreator() {

  // INPUTS
  const [taskAssignee, setTaskAssignee] = useState<User | null>(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskUser, setTaskUser] = useState<User | null>(null);

  return (
    <div className='column gap-m'>
        <TextInputLabel label="Name der Aufgabe" onChange={setTaskName} value={taskName} />
        <SelectLabel
                    label="Bearbeiter"
                    onChange={(value) => setSelectedAdmin(value)}
                    optionLabel="fullName"
                    optionValue="id"
                    options={adminOptions}
                    value={selectedAdmin}
                  />
    </div>
  )
}
