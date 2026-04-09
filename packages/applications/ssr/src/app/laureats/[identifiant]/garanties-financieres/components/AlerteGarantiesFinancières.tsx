import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

type AlerteGarantiesFinancièresProps = {
  title: string;
  description: React.ReactNode;
  action: {
    label: string;
    href: string;
  };
};
export const AlerteGarantiesFinancières: React.FC<AlerteGarantiesFinancièresProps> = ({
  description,
  title,
  action: { href, label },
}) => (
  <Alert
    severity="info"
    className="mb-4"
    small
    title={title}
    description={
      <div>
        <p>{description}</p>
        <Link href={href}>{label}</Link>
      </div>
    }
  />
);
