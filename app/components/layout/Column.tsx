'use client';

import { ReactNode, useEffect, useState } from 'react';
import styles from './Layout.module.css';

interface Props {
  alignItems?: 'start' | 'center' | 'end';
  children: ReactNode;
  className?: any;
  gap?: number | string;
  grow?: boolean;
  maxWidth?: number;
  width?: string | number;
}

export default function Column({ alignItems, children, className, gap = '1rem', grow, maxWidth, width = '100%' }: Props) {
  return (
    <div
      className={`${styles.column} ${className}`}
      style={{
        alignItems,
        flexGrow: grow ? 1 : undefined,
        gap,
        maxWidth,
        width,
      }}
    >
      {children}
    </div>
  );
}
