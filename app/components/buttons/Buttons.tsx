import { LucideIcon } from 'lucide-react';
import styles from './Buttons.module.css';

interface Props {
  disabled?: boolean;
  icon?: LucideIcon;
  label?: string;
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'regular' | 'large';
}

export function ContextButton({ disabled, icon: Icon, label, onClick }: Props) {
  return (
    <button
      className={disabled ? `${styles.buttonContext} ${styles.disabled}` : styles.buttonContext}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon size={14} />} <span>{label}</span>
    </button>
  );
}

export function HeaderButton({ disabled, icon: Icon, onClick }: Props) {
  return (
    <button
      className={disabled ? `${styles.buttonHeader} ${styles.disabled}` : styles.buttonHeader}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon size={16} />}
    </button>
  );
}

export function PrimaryButton({ disabled, icon: Icon, label, onClick, size }: Props) {
  return (
    <button
      className={
        disabled ? `${styles.buttonPrimary} ${styles.disabled}` : `${styles.buttonPrimary}`
      }
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon size={18} />} <span>{label}</span>
    </button>
  );
}

export function SecondaryButton({ disabled, icon: Icon, label, onClick }: Props) {
  return (
    <button
      className={disabled ? `${styles.buttonSecondary} ${styles.disabled}` : styles.buttonSecondary}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon size={18} />} <span>{label}</span>
    </button>
  );
}

export function TertiaryButton({ disabled, icon: Icon, label, onClick }: Props) {
  return (
    <button
      className={disabled ? `${styles.buttonTertiary} ${styles.disabled}` : styles.buttonTertiary}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon size={18} />} <span>{label}</span>
    </button>
  );
}
