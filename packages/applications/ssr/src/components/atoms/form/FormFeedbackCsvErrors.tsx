import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Accordion from '@codegouvfr/react-dsfr/Accordion';
import { fr } from '@codegouvfr/react-dsfr';
import { useFormStatus } from 'react-dom';

import { ImportCSV } from '@potentiel-libraries/csv';

import { FormStateCsvLineError } from '@/utils/formAction';

type FormFeedbackCsvLineErrorsProps = {
  formState: FormStateCsvLineError;
};

export const FormFeedbackCsvLineErrors: FC<FormFeedbackCsvLineErrorsProps> = ({ formState }) => {
  const { pending } = useFormStatus();

  if (pending) {
    return undefined;
  }

  const regroupedCsvLineErrors: Record<
    string,
    Array<ImportCSV.CsvLineError>
  > = formState.errors.reduce(
    (acc, error) => {
      if (!acc[error.line]) {
        acc[error.line] = [];
      }
      acc[error.line].push(error);
      return acc;
    },
    {} as Record<string, Array<ImportCSV.CsvLineError>>,
  );

  return (
    <Alert
      small
      severity="error"
      title={`Le fichier contient les erreurs suivantes :`}
      className="mt-6"
      description={
        <div className={`list-disc pl-3 my-6 ${fr.cx('fr-accordions-group')}`}>
          {Object.entries(regroupedCsvLineErrors).map(([ligne, erreurs]) => (
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
