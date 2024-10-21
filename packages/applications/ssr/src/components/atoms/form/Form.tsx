'use client';

import { FC, FormHTMLAttributes, ReactNode } from 'react';
import { useFormState } from 'react-dom';

import { formAction, ValidationErrors } from '@/utils/formAction';

import { Heading2 } from '../headings';

import { FormFeedback } from './FormFeedback';
import { FormPendingModal, FormPendingModalProps } from './FormPendingModal';
import { FormFeedbackCsvErrors } from './FormFeedbackCsvErrors';

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action' | 'method'> & {
  method?: 'POST';
  action: ReturnType<typeof formAction>;
  children: ReactNode;
  heading?: ReactNode;
  omitMandatoryFieldsLegend?: true;
  pendingModal?: FormPendingModalProps;
  actions: ReactNode;
  onValidationError?: (validationErrors: ValidationErrors) => void;
  successMessage?: string;
};

export const Form: FC<FormProps> = ({
  action,
  omitMandatoryFieldsLegend,
  onValidationError,
  children,
  heading,
  pendingModal,
  className,
  successMessage,
  actions,
  ...props
}) => {
  const [state, formAction] = useFormState(action, {
    status: undefined,
  });

  if (state.status === 'validation-error' && onValidationError) {
    onValidationError(state.errors);
  }

  return (
    <form action={formAction} {...props}>
      {heading && <Heading2 className="mb-4">{heading}</Heading2>}

      {pendingModal && <FormPendingModal {...pendingModal} />}

      {!omitMandatoryFieldsLegend && (
        <div className="text-sm italic my-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
        </div>
      )}

      <div className={`flex flex-col gap-5 mb-4 ${className || ''}`}>
        {state.status === 'success' && state.documentUrl && (
          <a className="w-fit" href={state.documentUrl} target="_blank" rel="noreferrer">
            Télécharger le document
          </a>
        )}
        {children}
        <div className="flex flex-col md:flex-row gap-2">{actions}</div>
      </div>

      <FormFeedback formState={state} successMessage={successMessage} />

      <FormFeedbackCsvErrors formState={state} />
    </form>
  );
};
