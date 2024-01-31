'use client';

import Alert, { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import { FC, FormHTMLAttributes } from 'react';
import { useFormState } from 'react-dom';

import { FormState, formAction } from '@/utils/formAction';

import { Heading2 } from '../headings';

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action'> & {
  action: ReturnType<typeof formAction>;
  children: React.ReactNode;
  heading?: React.ReactNode;
  omitMandatoryFieldsLegend?: true;
  onSuccess?: () => void;
  onValidationError?: (validationErrors: Array<string>) => void;
};

export const Form: FC<FormProps> = ({
  action,
  omitMandatoryFieldsLegend,
  onSuccess,
  onValidationError,
  children,
  heading,
  className,
  ...props
}) => {
  const [state, formAction] = useFormState(action, {
    status: undefined,
  });

  if (state.status === 'success' && onSuccess) {
    onSuccess();
  }
  if (state.status === 'form-error' && onValidationError) {
    onValidationError(state.errors);
  }

  return (
    <form action={formAction} {...props}>
      {heading && <Heading2>{heading}</Heading2>}

      <FormError formState={state} />

      {!omitMandatoryFieldsLegend && (
        <div className="text-sm italic my-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
        </div>
      )}

      <div className={`flex flex-col gap-5 ${className || ''}`}>{children}</div>
    </form>
  );
};

type FormErrorProps = {
  formState: FormState;
};

const FormError: FC<FormErrorProps> = ({ formState }) => {
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
