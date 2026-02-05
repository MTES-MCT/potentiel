'use client';

import { FC, FormHTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

import { formAction, ValidationErrors } from '@/utils/formAction';

import { Heading2 } from '../headings';

import { FormFeedback } from './FormFeedback';
import { FormPendingModal, FormPendingModalProps } from './FormPendingModal';
import { FormFeedbackCsvLineErrors } from './FormFeedbackCsvErrors';
import { FormActionButtons, FormActionButtonsProps } from './FormActionButtons';
import { FormFeedbackCsvColumnErrors } from './FormFeedbackCsvColumnErrors';

export type FormProps = {
  id?: string;
  action: ReturnType<typeof formAction>;
  children: ReactNode;
  heading?: ReactNode;
  omitMandatoryFieldsLegend?: true;
  pendingModal?: FormPendingModalProps;
  actionButtons?: FormActionButtonsProps;
  onValidationError?: (validationErrors: ValidationErrors) => void;
  onError?: FormHTMLAttributes<HTMLFormElement>['onError'];
  onInvalid?: FormHTMLAttributes<HTMLFormElement>['onInvalid'];
  className?: string;
};

export const Form: FC<FormProps> = ({
  id,
  action,
  omitMandatoryFieldsLegend,
  onValidationError,
  children,
  heading,
  pendingModal,
  actionButtons,
  onError,
  onInvalid,
  className,
}) => {
  const [csrfToken, setCsrfToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCSRFToken = async () => {
      const response = await fetch('/csrf', {
        method: 'HEAD',
      });

      const tokenFromHeader = response.headers.get('csrf_token');
      setCsrfToken(tokenFromHeader ?? 'empty_token');
    };

    fetchCSRFToken();
  }, []);

  const [state, formAction] = useFormState(action, {
    status: undefined,
  });

  if (!state) {
    router.push('/error');
  }

  useEffect(() => {
    if (onValidationError && state.status === 'validation-error') {
      onValidationError(state.errors);
    }
  }, [state.status]);

  return (
    // eslint-disable-next-line react/no-unknown-property
    <form id={id} action={formAction} onInvalid={onInvalid} onError={onError} className={className}>
      <input type="hidden" name="csrf_token" value={csrfToken ?? 'empty_token'} />
      {heading && <Heading2 className="mb-4">{heading}</Heading2>}
      <FormFeedback formState={state} />

      {pendingModal && (
        <FormPendingModal id={pendingModal.id} title={pendingModal.title}>
          {pendingModal.children}
        </FormPendingModal>
      )}
      {!omitMandatoryFieldsLegend && (
        <div className="text-sm italic my-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
        </div>
      )}
      <div className="flex flex-col gap-5">
        {children}
        {actionButtons && (
          <div className="flex flex-col md:flex-row gap-4">
            <FormActionButtons
              secondaryAction={actionButtons.secondaryAction}
              submitLabel={actionButtons.submitLabel}
              submitDisabled={actionButtons.submitDisabled}
            />
          </div>
        )}
      </div>
      {state.status === 'csv-line-error' && <FormFeedbackCsvLineErrors formState={state} />}
      {state.status === 'csv-column-error' && <FormFeedbackCsvColumnErrors formState={state} />}
    </form>
  );
};
