'use client';

import { FC } from 'react';
import Alert, { AlertProps } from '@codegouvfr/react-dsfr/Alert';

import { FormState } from '@/utils/formAction';

type FormErrorProps = {
  formState: FormState;
};

export const FormError: FC<FormErrorProps> = ({ formState }) => {
  switch (formState.status) {
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
