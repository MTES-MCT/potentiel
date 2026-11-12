'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';
import { useFormStatus } from 'react-dom';
import { match, P } from 'ts-pattern';

import type { FormState } from '@/utils/formAction';
import { Link } from '../LinkNoPrefetch';
import { FormAlertError } from './FormAlertError';

export type FormFeedbackProps = {
  formState: FormState;
};

export const FormFeedback: FC<FormFeedbackProps> = ({ formState }) => {
  const { pending } = useFormStatus();

  if (pending) {
    return undefined;
  }

  return match(formState)
    .with({ status: 'success' }, ({ result }) => {
      if (result) {
        const { successMessage, errors, link } = result;

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
                        <Link href={link.url}>{link.label}</Link>
                      </p>
                    )}
                  </div>
                }
              />
            )}

            {errors.length > 0 && (
              <Notice
                isClosable
                severity="warning"
                title=""
                description={
                  <>
                    <p>Certaines opérations ont rencontré les erreurs suivantes :</p>
                    <ul className="list-disc pl-3">
                      {errors.map(({ reason, key }) => (
                        <li key={key}>
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
    .with({ status: P.union('rate-limit-error', 'domain-error') }, ({ message }) => (
      <FormAlertError description={message} title="" />
    ))
    .with({ status: 'unknown-error' }, () => (
      <FormAlertError description="Une erreur est survenue" title="" />
    ))
    .with({ status: 'validation-error' }, () => (
      <FormAlertError
        description="Erreur lors de la validation des données du formulaire"
        title=""
      />
    ))
    .with({ status: 'csrf-error' }, () => (
      <FormAlertError
        description="L'intégrité des données n'a pas pu être vérifiée. Veuillez recharger la page et réessayer."
        title=""
      />
    ))
    .otherwise(() => null);
};
