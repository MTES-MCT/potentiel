import { fr } from '@codegouvfr/react-dsfr';
import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';
import { useFormStatus } from 'react-dom';

import type {
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
    <Notice
      severity="alert"
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
