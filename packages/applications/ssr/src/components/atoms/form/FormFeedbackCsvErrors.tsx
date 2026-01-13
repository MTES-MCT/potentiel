import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Accordion from '@codegouvfr/react-dsfr/Accordion';
import { fr } from '@codegouvfr/react-dsfr';
import { useFormStatus } from 'react-dom';

import { ImportCSV } from '@potentiel-libraries/csv';

import { FormState } from '@/utils/formAction';

type FormFeedbackCsvErrorsProps = {
  formState: FormState;
};

export const FormFeedbackCsvErrors: FC<FormFeedbackCsvErrorsProps> = ({ formState }) => {
  const { pending } = useFormStatus();

  if (pending || formState.status !== 'csv-error') {
    return undefined;
  }

  const regroupedErrors: Record<string, Array<ImportCSV.CsvError>> = formState.errors.reduce(
    (acc, error) => {
      if (!acc[error.line]) {
        acc[error.line] = [];
      }
      acc[error.line].push(error);
      return acc;
    },
    {} as Record<string, Array<ImportCSV.CsvError>>,
  );

  return (
    <Alert
      small
      severity="error"
      title={`Le fichier contient les erreurs suivantes :`}
      className="mt-6"
      description={
        <div className={`list-disc pl-3 my-6 ${fr.cx('fr-accordions-group')}`}>
          {Object.entries(regroupedErrors).map(([ligne, erreurs]) => (
            <Accordion label={`Ligne ${Number(ligne) + 1}`} defaultExpanded key={ligne}>
              <ul className="list-disc pl-3">
                {erreurs.map((erreur) => (
                  <li key={`${erreur.field}-${erreur.line}`}>
                    Champ : <span className="font-semibold">{erreur.field}</span>
                    <br />
                    Erreur : <span className="font-semibold">{erreur.message}</span>
                  </li>
                ))}
              </ul>
            </Accordion>
          ))}
        </div>
      }
    />
  );
};
