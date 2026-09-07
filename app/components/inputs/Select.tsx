import { Dropdown } from 'primereact/dropdown';
import Column from '../layout/Column';
import { SelectItemOptionsType } from 'primereact/selectitem';
import { User } from '@/app/types/Database';

interface Props {
  label: string;
  onChange: (value: string) => void;
  options?: SelectItemOptionsType;
  optionLabel: string;
  optionValue: string;
  value: string | number;
}

interface UserProps {
  label: string;
  onChange: (value: User) => void;
  options?: SelectItemOptionsType;
  optionLabel: string;
  value: User | null;
}

export function SelectLabel({ label, onChange, options, optionLabel, optionValue, value }: Props) {
  return (
    <Column gap={4}>
      <label>{label}</label>
      <Dropdown
        onChange={(e) => onChange(e.value)}
        options={options}
        optionLabel={optionLabel}
        optionValue={optionValue}
        value={value}
      />
    </Column>
  );
}

export function UserSelectLabel({ label, onChange, options, value }: UserProps) {
  if (!options) return;
  const userOptions = options
    .map((a) => ({
      ...a,
      fullName: `${a.user_name_last}, ${a.user_name_first}`,
    }))
    .sort((a: User, b: User) => a.user_name_last.localeCompare(b.user_name_last));

  const matchedValue = userOptions.find((o) => o.id === value?.id) ?? null;

  return (
    <Column gap={4}>
      <label>{label}</label>
      <Dropdown
        filter
        filterPlaceholder="Suchen"
        onChange={(e) => onChange(e.value)}
        options={userOptions}
        optionLabel="fullName"
        value={matchedValue}
      />
    </Column>
  );
}
