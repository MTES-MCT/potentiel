'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import { FC, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';
import { SubmitButton } from '../atoms/form/SubmitButton';

export type ModalWithFormProps = {
  id: string;
  acceptButtonLabel: string;
  form: Omit<FormProps, 'actions'>;
  isOpen: boolean;
  rejectButtonLabel: string;
  onClose: () => void;
  title: string;
};

export const ModalWithForm: FC<ModalWithFormProps> = ({
  id,
  acceptButtonLabel,
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
        key={`form-${id}`}
        actionButtons={{
          submitButtonLabel,
          backButton: {
            url: Routes.GarantiesFinancières.détail(identifiantProjet),
            label: 'Retour aux détails des garanties financières',
          },
        }}
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
