import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC, useEffect } from 'react';

type Props = {
  message: string;
};

export const FormSuccessAlert: FC<Props> = ({ message }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  return (
    <div className="mb-4">
      <Alert small closable severity="success" description={<p>{message}</p>} />
    </div>
  );
};
