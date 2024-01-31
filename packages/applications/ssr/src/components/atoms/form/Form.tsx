'use client';

import { FC, FormHTMLAttributes } from 'react';
import { useFormState } from 'react-dom';

import { formAction } from '@/utils/formAction';

import { Heading2 } from '../headings';

import { FormError } from './FormError';

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
