import { ReactNode } from 'react';
import styles from './Layout.module.css';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  header?: string;
  target?: string;
  targetLabel?: string;
}

export default function DashboardContainer({ children, header, target, targetLabel }: Props) {
  return (
    <div className={styles.dashboardContainer}>
      {header && (
        <div className={styles.dashboardContainerHeader}>
          <h2 className={styles.dashboardHeader}>{header}</h2>
          {target && (
            <Link className="container-link" href={target}>
              {targetLabel}
            </Link>
          )}
        </div>
      )}
      <div className={styles.dashboardContent}>{children}</div>
    </div>
  );
}
