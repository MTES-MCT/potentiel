'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import { FC, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Form, FormProps } from '../atoms/form/Form';
import { SubmitButton } from '../atoms/form/SubmitButton';

export type ModalWithFormProps = {
  acceptButtonLabel: string;
  form: Omit<FormProps, 'actions'>;
  isOpen: boolean;
  rejectButtonLabel: string;
  onClose: () => void;
  title: string;
};

export const ModalWithForm: FC<ModalWithFormProps> = ({
  acceptButtonLabel,
  form,
  isOpen,
  rejectButtonLabel,
  onClose,
  title,
}) => {
  // trick to reset the form when re-opening the modal
  const id = uuid();

  const [modal] = useState(
    createModal({
      id: `form-modal-${title}`,
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

  const onFormSuccess = () => {
    form.onSuccess && form.onSuccess();
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
        {...form}
        onSuccess={onFormSuccess}
        key={id}
        actions={
          <>
            <Button priority="secondary" onClick={handleRejectClick} type="button">
              {rejectButtonLabel}
            </Button>
            <SubmitButton>{acceptButtonLabel}</SubmitButton>
          </>
        }
      >
        {form.children}
      </Form>
    </modal.Component>
  );
};
