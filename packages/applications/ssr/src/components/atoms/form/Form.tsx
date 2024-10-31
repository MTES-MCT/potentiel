'use client';

import { FC, FormHTMLAttributes, ReactNode } from 'react';
import { useFormState } from 'react-dom';

import { formAction, ValidationErrors } from '@/utils/formAction';

import { Heading2 } from '../headings';

import { FormFeedback } from './FormFeedback';
import { FormPendingModal, FormPendingModalProps } from './FormPendingModal';
import { FormFeedbackCsvErrors } from './FormFeedbackCsvErrors';

export type FormProps = {
  id?: string;
  action: ReturnType<typeof formAction>;
  children: ReactNode;
  heading?: ReactNode;
  omitMandatoryFieldsLegend?: true;
  pendingModal?: FormPendingModalProps;
  actions: ReactNode;
  onValidationError?: (validationErrors: ValidationErrors) => void;
  onError?: FormHTMLAttributes<HTMLFormElement>['onError'];
  onInvalid?: FormHTMLAttributes<HTMLFormElement>['onInvalid'];
  successMessage?: string;
};

export const Form: FC<FormProps> = ({
  id,
  action,
  omitMandatoryFieldsLegend,
  onValidationError,
  children,
  heading,
  pendingModal,
  successMessage,
  actions,
  onError,
  onInvalid,
}) => {
  const [state, formAction] = useFormState(action, {
    status: undefined,
  });

  if (state.status === 'validation-error' && onValidationError) {
    onValidationError(state.errors);
  }

  return (
    // eslint-disable-next-line react/no-unknown-property
    <form id={id} action={formAction} onInvalid={onInvalid} onError={onError}>
      {heading && <Heading2 className="mb-4">{heading}</Heading2>}

      <FormFeedback formState={state} successMessage={successMessage} />

      {pendingModal && (
        <FormPendingModal id={pendingModal.id} title={pendingModal.title}>
          {children ?? null}
        </FormPendingModal>
      )}

      {!omitMandatoryFieldsLegend && (
        <div className="text-sm italic my-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
        </div>
      )}

      <div className="flex flex-col gap-5">
        {children}
        <div className="flex flex-col md:flex-row gap-2">{actions}</div>
      </div>

      <FormFeedbackCsvErrors formState={state} />
    </form>
  );
};
