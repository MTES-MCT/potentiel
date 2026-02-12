import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { fr } from '@codegouvfr/react-dsfr';
import { useFormStatus } from 'react-dom';

import { FormStateCsvColumnError } from '@/utils/formAction';

type FormFeedbackCsvColumnErrorsProps = {
  formState: FormStateCsvColumnError;
};

export const FormFeedbackCsvColumnErrors: FC<FormFeedbackCsvColumnErrorsProps> = ({
  formState,
}) => {
  const { pending } = useFormStatus();

  if (pending) {
    return undefined;
  }

  return (
    <Alert
      small
      severity="error"
      title={`Des colonnes essentielles sont manquantes dans le fichier :`}
      className="mt-6"
      description={
        <ul className={`list-disc pl-3 my-6 ${fr.cx('fr-accordions-group')}`}>
          {formState.errors.map((error) => (
            <li key={`column-error-${error.column}`}>{error.column}</li>
          ))}
        </ul>
      }
    />
  );
};
