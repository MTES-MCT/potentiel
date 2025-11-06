'use client';

import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { match, P } from 'ts-pattern';

import { FormState } from '@/utils/formAction';

import { FormAlertError } from '../FormAlertError';

export type FormFeedbackProps = {
  formState: FormState;
};

export const FormFeedback: FC<FormFeedbackProps> = ({ formState }) => {
  const { pending } = useFormStatus();

  if (pending) {
    return undefined;
  }

  return match(formState)
    .with({ status: 'success' }, (formState) => {
      if (formState.result) {
        const {
          result: { successMessage, errors, link },
        } = formState;

        return (
          <>
            {successMessage && (
              <Alert
                small
                closable
                severity="success"
                description={
                  <div className="flex flex-col gap-2">
                    <p>{successMessage}</p>
                    {link && (
                      <p>
                        <Link href={link.href}>{link.label}</Link>
                      </p>
                    )}
                  </div>
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
    })
    .with({ status: P.union('rate-limit-error', 'domain-error') }, (formState) => {
      return <FormAlertError description={formState.message} />;
    })

    .with({ status: 'validation-error' }, () => (
      <FormAlertError description="Erreur lors de la validation des données du formulaire" />
    ))

    .with({ status: 'unknown-error' }, () => (
      <FormAlertError description="Une erreur est survenue" />
    ))
    .otherwise(() => null);
};
