import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

type FormAlertErrorProps = {
  title: string;
  description: string;
};

export const FormAlertError: FC<FormAlertErrorProps> = ({ title, description }) => (
  <Notice isClosable severity="alert" title={title} description={description} className="mb-4" />
);
