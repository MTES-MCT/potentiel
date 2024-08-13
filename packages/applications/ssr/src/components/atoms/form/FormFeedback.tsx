'use client';

import { FC } from 'react';
import Alert, { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import { fr } from '@codegouvfr/react-dsfr';
import { Accordion } from '@codegouvfr/react-dsfr/Accordion';

import { CsvError } from '@potentiel-libraries/csv';

import { FormState } from '@/utils/formAction';

export type FormFeedbackProps = {
  formState: FormState;
  successMessage?: string;
};

export const FormFeedback: FC<FormFeedbackProps> = ({ formState, successMessage }) => {
  switch (formState.status) {
    case 'success':
      if (formState.result) {
        const {
          result: { successCount, errors },
        } = formState;

        return (
          <>
            {successCount > 0 && successMessage && (
              <Alert
                small
                severity="success"
                description={
                  <p>
                    {successCount} {successMessage}
                  </p>
                }
              />
            )}
            {errors.length > 0 && (
              <Alert
                small
                severity="warning"
                description={
                  <>
                    <p>Certaines opérations ont rencontrées les erreurs suivantes :</p>
                    <ul className="list-disc pl-3">
                      {errors.map(({ reason, key }, index) => (
                        <li key={index}>
                          <span className="font-bold">{key}</span> : {reason}
                        </li>
                      ))}
                    </ul>
                  </>
                }
              />
            )}
          </>
        );
      }

      return <Alert small severity="success" description="L'opération est un succès" />;

    case 'domain-error':
      return <AlertError description={formState.message} />;

    case 'form-error':
      return <AlertError description="Erreur lors de la validation des données du formulaire" />;

    case 'csv-error':
      const regroupedErrors = formState.errors.reduce(
        (acc, error) => {
          if (!acc[error.line]) {
            acc[error.line] = [];
          }
          acc[error.line].push(error);
          return acc;
        },
        {} as Record<string, CsvError[]>,
      );

      return (
        <AlertError
          title={`Le fichier contient les erreurs suivantes :`}
          description={
            <div className={`list-disc pl-3 my-6 ${fr.cx('fr-accordions-group')}`}>
              {Object.entries(regroupedErrors).map(([ligne, erreurs]) => (
                <Accordion label={`Ligne ${Number(ligne) + 1}`} defaultExpanded>
                  <ul className="list-disc pl-3">
                    {erreurs.map((erreur) => (
                      <li key={`${ligne}-${erreur.field}`}>
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

    case 'unknown-error':
      return <AlertError description="Une erreur est survenue" />;

    default:
      return null;
  }
};

type AlertErrorProps = Omit<AlertProps.Small, 'small'>;

const AlertError: FC<AlertErrorProps> = ({ title, description }) => (
  <Alert small severity="error" title={title} description={description} className="mb-4" />
);
