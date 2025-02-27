'use client';

import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { useFormStatus } from 'react-dom';

import { FormState } from '@/utils/formAction';

import { FormAlertError } from './FormAlertError';

export type FormFeedbackProps = {
  formState: FormState;
  successMessage?: string;
};

export const FormFeedback: FC<FormFeedbackProps> = ({ formState, successMessage }) => {
  const { pending } = useFormStatus();

  if (pending) {
    return undefined;
  }

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
                closable
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
                closable
                severity="warning"
                description={
                  <>
                    <p>Certaines opérations ont rencontré les erreurs suivantes :</p>
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

      return <Alert closable small severity="success" description="L'opération est un succès" />;

    case 'domain-error':
      return <FormAlertError description={formState.message} />;

    case 'unknown-error':
      return <FormAlertError description="Une erreur est survenue" />;

    case 'validation-error':
      return (
        <FormAlertError description="Erreur lors de la validation des données du formulaire" />
      );

    default:
      return null;
  }
};
