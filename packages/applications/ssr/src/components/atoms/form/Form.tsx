'use client';

import { FC, FormHTMLAttributes } from 'react';
import { useFormState } from 'react-dom';

import { formAction } from '@/utils/formAction';

import { Heading2 } from '../headings';

import { FormFeedback } from './FormFeedback';
import { FormPendingModal, FormPendingModalProps } from './FormPendingModal';

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action'> & {
  action: ReturnType<typeof formAction>;
  children: React.ReactNode;
  buttons: React.ReactNode;
  heading?: React.ReactNode;
  omitMandatoryFieldsLegend?: true;
  pendingModal?: FormPendingModalProps;
  onSuccess?: () => void;
  onValidationError?: (validationErrors: Array<string>) => void;
};

export const Form: FC<FormProps> = async ({
  action,
  omitMandatoryFieldsLegend,
  onSuccess,
  onValidationError,
  children,
  buttons,
  heading,
  pendingModal,
  className,
  ...props
}) => {
  const TEMPORARY_ONSUCCESS_WAITING_TIME_IN_MS = 2000;

  const [state, formAction] = useFormState(action, {
    status: undefined,
  });

  if (state.status === 'success' && onSuccess) {
    await new Promise((resolve) => setTimeout(resolve, TEMPORARY_ONSUCCESS_WAITING_TIME_IN_MS));
    onSuccess();
  }
  if (state.status === 'form-error' && onValidationError) {
    onValidationError(state.errors);
  }

  return (
    <form action={formAction} {...props}>
      {heading && <Heading2 className="mb-4">{heading}</Heading2>}

      <FormFeedback formState={state} />
      {pendingModal && <FormPendingModal {...pendingModal} />}

      {!omitMandatoryFieldsLegend && (
        <div className="text-sm italic my-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
        </div>
      )}

      <div className={`flex flex-col gap-5 ${className || ''}`}>
        {children}

        <div className="flex flex-col md:flex-row gap-4 mt-5">{buttons}</div>
      </div>
    </form>
  );
};
