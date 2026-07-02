interface Props {
  src: string;
}

export default function DocPDF({ src }: Props) {
  return <iframe src={src} />;
}
