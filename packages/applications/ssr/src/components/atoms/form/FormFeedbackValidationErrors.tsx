import { FC } from 'react';
import { useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { FormState } from '@/utils/formAction';

export type FormFeedbackValidationProps = {
  formState: FormState;
};

export const FormFeedbackValidationErrors: FC<FormFeedbackValidationProps> = ({ formState }) => {
  const { pending } = useFormStatus();

  if (pending || formState.status !== 'validation-error') {
    return undefined;
  }

  return (
    <Alert
      small
      severity="error"
      className="mt-6"
      description={'Erreur lors de la validation des données du formulaire'}
    />
  );
};
