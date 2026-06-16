'use client';

import { Chart } from 'primereact/chart';
import DividerBlock from '../DividerBlock';
import { Registration } from '@/app/actions/stats';
import styles from './Admin.module.css';

interface Props {
  chart?: boolean;
  disclaimer: string;
  header: string;
  registrationData?: Registration[];
  value: number;
}

const data = {
  labels: [1, 2, 3, 4, 5],
  datasets: [
    {
      borderColor: '#4B39EF',
      data: [0, 37, 48, 69, 103],
      tension: 0.75,
    },
  ],
};

const plugin = {
  id: 'gradientFill',
  beforeInit(chart: any) {
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(75, 57, 239, 0.25)');
    gradient.addColorStop(1, 'rgba(75, 57, 239, 0)');
    chart.data.datasets[0].backgroundColor = gradient;
    chart.data.datasets[0].fill = true;
  },
};

const options = {
  elements: {
    point: { radius: 0 },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        color: 'transparent',
      },
      ticks: {
        color: 'transparent',
      },
    },
    y: {
      display: false,
      grid: {
        color: 'transparent',
      },
      ticks: {
        color: 'transparent',
      },
    },
  },
};

export default function StatCard({ chart, disclaimer, header, registrationData, value }: Props) {
  const resolvedData = {
    labels: registrationData?.map((r) =>
      new Date(r.month).toLocaleString('de-DE', { month: 'short', year: '2-digit' })
    ) ?? [1, 2, 3, 4, 5],
    datasets: [
      {
        borderColor: '#4B39EF',
        data: registrationData?.map((r) => r.count) ?? [0, 37, 48, 69, 103],
        tension: 0.75,
      },
    ],
  };

  return (
    <div className="container" style={{ overflow: 'hidden', position: 'relative' }}>
      <span className={styles.cardHeader}>{header}</span>
      <DividerBlock height={1} />
      <div className="row space-between">
        <div className="column">
          <span className={styles.value}>{value}</span>
          <span className={styles.disclaimer}>{disclaimer}</span>
        </div>
      </div>
      {chart && (
        <Chart
          data={resolvedData}
          options={options}
          plugins={[plugin]}
          style={{ bottom: 0, position: 'absolute', right: 0 }}
          type="line"
          width="200px"
        />
      )}
    </div>
  );
}
