'use client';

import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  type FC,
  type FormHTMLAttributes,
  type ReactNode,
  startTransition,
  useActionState,
  useEffect,
  useRef,
} from 'react';

import type { formAction, ValidationErrors } from '@/utils/formAction';
import { Heading2 } from '../headings';
import { FormActionButtons, type FormActionButtonsProps } from './FormActionButtons';
import { FormCsrfInput } from './FormCsrfInput';
import { FormFeedback } from './FormFeedback';
import { FormFeedbackCsvColumnErrors } from './FormFeedbackCsvColumnErrors';
import { FormFeedbackCsvLineErrors } from './FormFeedbackCsvErrors';
import { FormPendingModal, type FormPendingModalProps } from './FormPendingModal';

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
  confirmSubmit?: {
    title: string;
    children: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
  };
};

const ConfirmSubmitModal = createModal({
  id: 'form-confirm-submit',
  isOpenedByDefault: false,
});

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
  confirmSubmit,
  className,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retourUrl = searchParams.get('retour');

  const [state, formAction] = useActionState(action, {
    status: undefined,
  });

  if (!state) {
    router.push('/error');
  }

  useEffect(() => {
    if (onValidationError && state.status === 'validation-error') {
      onValidationError(state.errors);
    }
  }, [state.status, onValidationError, state]);

  const pendingFormData = useRef<FormData | null>(null);

  return (
    <form
      id={id}
      // use onSubmit instead of action to keep the form
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        if (confirmSubmit) {
          pendingFormData.current = formData;
          ConfirmSubmitModal.open();
          return;
        }

        startTransition(() => {
          formAction(formData);
        });
      }}
      onInvalid={onInvalid}
      onError={onError}
      className={className}
    >
      {confirmSubmit && (
        <ConfirmSubmitModal.Component
          title={confirmSubmit.title}
          size="small"
          buttons={[
            {
              children: confirmSubmit.cancelLabel ?? 'Annuler',
              type: 'button',
              priority: 'secondary',
              onClick: () => {
                ConfirmSubmitModal.close();
                pendingFormData.current = null;
              },
            },
            {
              children: confirmSubmit.confirmLabel ?? 'Confirmer',
              type: 'button',
              onClick: () => {
                const formData = pendingFormData.current;

                ConfirmSubmitModal.close();
                pendingFormData.current = null;

                if (formData) {
                  startTransition(() => {
                    formAction(formData);
                  });
                }
              },
              doClosesModal: true,
            },
          ]}
        >
          {confirmSubmit.children}
        </ConfirmSubmitModal.Component>
      )}
      <FormCsrfInput />
      {retourUrl && (
        <input
          type="hidden"
          name="retour"
          value={new URL(retourUrl, window.location.origin).toString()}
        />
      )}
      {heading && <Heading2 className="mb-4">{heading}</Heading2>}
      <FormFeedback formState={state} />

      {pendingModal && (
        <FormPendingModal id={pendingModal.id} title={pendingModal.title}>
          {pendingModal.children}
        </FormPendingModal>
      )}
      {!omitMandatoryFieldsLegend && (
        <div className="text-xs italic my-4">
          Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires.
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
      {(state.status === 'csv-missing-column-error' ||
        state.status === 'csv-duplicate-header-error') && (
        <FormFeedbackCsvColumnErrors formState={state} />
      )}
    </form>
  );
};
