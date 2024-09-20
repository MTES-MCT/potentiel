import { FC } from 'react';
import Alert, { AlertProps } from '@codegouvfr/react-dsfr/Alert';

type AlertErrorProps = Omit<AlertProps.Small, 'small'>;

export const AlertError: FC<AlertErrorProps> = ({ title, description }) => (
  <Alert small severity="error" title={title} description={description} className="mb-4" />
);
