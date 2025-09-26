'use client';

import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import { FC, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';

export type ModalWithFormProps = {
  id: string;
  form: Omit<FormProps, 'actions' | 'actionButtons'>;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export const ModalWithForm: FC<ModalWithFormProps> = ({ id, form, isOpen, onClose, title }) => {
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
        key={`form-${id}`}
        actionButtons={{
          submitLabel: 'Oui',
          secondaryAction: {
            type: 'cancel',
            onClick: handleRejectClick,
          },
        }}
      >
        {form.children}
      </Form>
    </modal.Component>
  );
};
