'use client';

import { FC } from 'react';
import Alert, { AlertProps } from '@codegouvfr/react-dsfr/Alert';

import { FormState } from '@/utils/formAction';

export type FormFeedbackProps = {
  formState: FormState;
};

export const FormFeedback: FC<FormFeedbackProps> = ({ formState }) => {
  switch (formState.status) {
    case 'success':
      if (formState.result) {
        const {
          result: { successCount, errors },
        } = formState;

        return (
          <>
            {successCount > 0 && (
              <Alert
                small
                severity="success"
                description={
                  <p>
                    {successCount} date{successCount > 1 ? 's' : ''} de mise en service transmise
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
                    <p>
                      Certaines dates n'ont pas pu être transmise, les erreurs rencontrées sont les
                      suivantes :
                    </p>
                    <ul className="list-disc pl-3">
                      {errors.map(({ reason, referenceDossier }, index) => (
                        <li key={index}>
                          <span className="font-bold">{referenceDossier}</span> : {reason}
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
      return (
        <AlertError
          title={`Le fichier contient les erreurs suivantes :`}
          description={
            <ul className="list-disc pl-3 mt-2">
              {formState.errors.map((error) => (
                <li key={`${error.line}-${error.field}`}>
                  Ligne {error.line} (champ {error.field}) : {error.message}
                </li>
              ))}
            </ul>
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
