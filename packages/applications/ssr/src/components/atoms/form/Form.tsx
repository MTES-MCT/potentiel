'use client';

import { FC, FormHTMLAttributes, ReactNode } from 'react';
import { useFormState } from 'react-dom';

import { formAction } from '@/utils/formAction';

import { Heading2 } from '../headings';

import { FormFeedback } from './FormFeedback';
import { FormPendingModal, FormPendingModalProps } from './FormPendingModal';
import { FormFeedbackCsvError } from './FormFeedbackCsvErrors';

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action' | 'method'> & {
  method?: 'POST';
  action: ReturnType<typeof formAction>;
  children: ReactNode;
  heading?: ReactNode;
  omitMandatoryFieldsLegend?: true;
  pendingModal?: FormPendingModalProps;
  actionButtons: ReactNode;
  onSuccess?: () => void;
  onValidationError?: (validationErrors: Array<string>) => void;
  successMessage?: string;
};

export const Form: FC<FormProps> = ({
  action,
  omitMandatoryFieldsLegend,
  onSuccess,
  onValidationError,
  children,
  heading,
  pendingModal,
  className,
  successMessage,
  actionButtons,
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
      {heading && <Heading2 className="mb-4">{heading}</Heading2>}

      <FormFeedback formState={state} successMessage={successMessage} />
      {pendingModal && <FormPendingModal {...pendingModal} />}

      {!omitMandatoryFieldsLegend && (
        <div className="text-sm italic my-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
        </div>
      )}

      <div className={`flex flex-col gap-5 ${className || ''}`}>
        {children}

        <div className="flex flex-col md:flex-row gap-2">{actionButtons}</div>
      </div>

      <FormFeedbackCsvError formState={state} />
    </form>
  );
};
