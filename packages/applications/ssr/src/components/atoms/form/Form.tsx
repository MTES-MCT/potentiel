'use client';

import { FC, FormHTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

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
  const [csrfToken, setCsrfToken] = useState('');
  const [state, formAction] = useFormState(action, {
    status: undefined,
  });

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

  if (!state) {
    router.push('/error');
  }

  useEffect(() => {
    if (onValidationError && state.status === 'validation-error') {
      onValidationError(state.errors);
    }
  }, [state.status]);

  const handleOnChange = () => onValidationError && onValidationError({});

  return (
    <form
      id={id}
      action={formAction}
      onInvalid={onInvalid}
      // eslint-disable-next-line react/no-unknown-property
      onError={onError}
      onChange={handleOnChange}
    >
      <input type="hidden" name="csrf_token" value={csrfToken ?? 'empty_token'} />
      {heading && <Heading2 className="mb-4">{heading}</Heading2>}
      <FormFeedback formState={state} successMessage={successMessage} />

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
        <div className="flex flex-col md:flex-row gap-2">{actions}</div>
      </div>
      <FormFeedbackCsvErrors formState={state} />
    </form>
  );
};
