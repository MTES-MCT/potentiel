import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

type Props = {
  message: string;
};

export const FormSuccessAlert: FC<Props> = ({ message }) => (
  <div className="mb-4">
    <Alert small closable severity="success" description={<p>{message}</p>} />
  </div>
);
