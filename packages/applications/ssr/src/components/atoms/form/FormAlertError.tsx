import Alert, { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

type FormAlertErrorProps = Omit<AlertProps.Small, 'small'>;

export const FormAlertError: FC<FormAlertErrorProps> = ({ title, description }) => (
  <Alert small closable severity="error" title={title} description={description} className="mb-4" />
);
