'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import { FC, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';
import { SubmitButton, SubmitButtonProps } from '../atoms/form/SubmitButton';

export type ModalWithFormProps = {
  id: string;
  acceptButtonLabel: string;
  disabledSubmitCondition?: SubmitButtonProps['disabledCondition'];
  form: Omit<FormProps, 'actions'>;
  isOpen: boolean;
  rejectButtonLabel: string;
  onClose: () => void;
  title: string;
};

export const ModalWithForm: FC<ModalWithFormProps> = ({
  id,
  acceptButtonLabel,
  disabledSubmitCondition,
  form,
  isOpen,
  rejectButtonLabel,
  onClose,
  title,
}) => {
  // trick to reset the form when re-opening the modal
  const [modal] = useState(
    createModal({
      id: `form-modal-${id}`,
      isOpenedByDefault: isOpen,
    }),
  );

  const closeModal = () => {
    onClose?.();
    modal.close();
  };

  const handleRejectClick = async () => {
    closeModal();
  };

  // close modal if inside "fermer" button is triggered
  useIsModalOpen(modal, {
    onConceal: () => closeModal(),
  });

  if (isOpen) {
    modal.open();
  }

  return (
    <modal.Component title={title}>
      <Form
        action={form.action}
        heading={form.heading}
        omitMandatoryFieldsLegend={form.omitMandatoryFieldsLegend}
        pendingModal={form.pendingModal}
        onValidationError={form.onValidationError}
        successMessage={form.successMessage}
        key={`form-${id}`}
        actions={
          <>
            <Button priority="secondary" onClick={handleRejectClick} type="button">
              {rejectButtonLabel}
            </Button>
            <SubmitButton disabledCondition={disabledSubmitCondition}>
              {acceptButtonLabel}
            </SubmitButton>
          </>
        }
      >
        {form.children}
      </Form>
    </modal.Component>
  );
};
