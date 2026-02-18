import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { fr } from '@codegouvfr/react-dsfr';
import { useFormStatus } from 'react-dom';

import {
  FormStateCsvDuplicateColumnError,
  FormStateCsvMissingColumnError,
} from '@/utils/formAction';

type FormFeedbackCsvColumnErrorsProps = {
  formState: FormStateCsvMissingColumnError | FormStateCsvDuplicateColumnError;
};

export const FormFeedbackCsvColumnErrors: FC<FormFeedbackCsvColumnErrorsProps> = ({
  formState: { columns, status },
}) => {
  const { pending } = useFormStatus();

  if (pending) {
    return undefined;
  }

  return (
    <Alert
      small
      severity="error"
      title={
        status === 'csv-missing-column-error'
          ? `Des colonnes essentielles sont manquantes dans le fichier :`
          : `Des colonnes sont en doublon dans le fichier :`
      }
      className="mt-6"
      description={
        <ul className={`list-disc pl-3 my-6 ${fr.cx('fr-accordions-group')}`}>
          {columns.map((column) => (
            <li key={`column-error-${column}`}>{column}</li>
          ))}
        </ul>
      }
    />
  );
};
