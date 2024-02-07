'use client';

import { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import Alert, { AlertProps } from '@codegouvfr/react-dsfr/Alert';

import { FormState } from '@/utils/formAction';

type FormFeedbackProps = {
  formState: FormState;
};

export const FormFeedback: FC<FormFeedbackProps> = ({ formState }) => {
  switch (formState.status) {
    case 'success':
      return <Alert small severity="success" description="L'opération est un succès" />;

    case 'csv-success':
      return (
        <Alert
          small
          severity={formState.result.error.length === 0 ? 'success' : 'info'}
          description={
            <>
              {formState.result.success.length > 0 && (
                <p>
                  <i
                    className={`${fr.cx('fr-icon-success-fill')} ${
                      fr.colors.decisions.background.actionHigh.success.default
                    } mr-1`}
                  />
                  {formState.result.success.length} date de mise en service transmise
                </p>
              )}
              {formState.result.error.length > 0 && (
                <>
                  <p>
                    {formState.result.error.length} ligne
                    {formState.result.error.length > 1 ? 's' : ''} en erreur
                  </p>
                  <ul>
                    {formState.result.error.details.map((error, index) => (
                      <li key={index}>{error.reason}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          }
        />
      );

    case 'domain-error':
    case 'csv-error-empty':
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
