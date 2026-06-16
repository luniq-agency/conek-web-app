import Image from 'next/image';
import DividerBlock from './DividerBlock';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loader() {
  const Tailwind = {
    global: {
      css: `
            @keyframes p-progress-spinner-color {
                 100%, 0% {
                stroke: #ff5757;
            }
            40% {
                stroke: #696cff;
            }
            66% {
                stroke: #1ea97c;
            }
            80%, 90% {
                stroke: #cc8925;
            }
            }
        }`,
    },
  };
  return (
    <div className="loader-wrapper">
      <Image alt="CONEK Logo" height={30} src="/conek-logo-weiss.svg" width={150} />
      <DividerBlock height={1} />
      <ProgressSpinner strokeWidth="4" />
    </div>
  );
}
