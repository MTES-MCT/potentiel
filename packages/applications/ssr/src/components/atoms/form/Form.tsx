'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
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

const FormError: FC<{ formState: FormState }> = ({ formState }) => {
  switch (formState.status) {
    case 'domain-error':
      return <Alert small severity="error" description={formState.message} className="mb-4" />;

    case 'form-error':
      return (
        <Alert
          small
          severity="error"
          description="Erreur lors de la validation des données du formulaire"
          className="mb-4"
        />
      );

    case 'csv-error':
      return (
        <Alert
          severity="error"
          title={`Le fichier présente plusieurs erreurs de validation`}
          className="my-6"
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
      return (
        <Alert small severity="error" description="Une erreur est survenue" className="mb-4" />
      );

    default:
      return null;
  }
};
