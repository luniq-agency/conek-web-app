import { ReactNode } from 'react';
import styles from './Layout.module.css';

interface Props {
  children: ReactNode;
  columns: number;
  gap: string | number;
}

export default function Grid({ children, columns, gap }: Props) {
  return (
    <div className={styles.grid} style={{ gap, gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {children}
    </div>
  );
}
