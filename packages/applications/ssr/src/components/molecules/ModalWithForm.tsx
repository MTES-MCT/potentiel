'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import { Dispatch, FC, SetStateAction, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';
import { SubmitButton } from '../atoms/form/SubmitButton';

export type ModalWithFormProps = {
  acceptButtonLabel: string;
  form: FormProps;
  isOpen: boolean;
  onRejectClick?: () => any;
  rejectButtonLabel: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
};

export const ModalWithForm: FC<ModalWithFormProps> = ({
  acceptButtonLabel,
  form,
  isOpen,
  onRejectClick,
  rejectButtonLabel,
  setIsOpen,
  title,
}) => {
  const [modal, _] = useState(
    createModal({
      id: `form-modal-${title}`,
      isOpenedByDefault: isOpen,
    }),
  );

  const closeModal = () => {
    setIsOpen(false);
    modal.close();
  };

  const handleRejectClick = async () => {
    onRejectClick && (await onRejectClick());
    closeModal();
  };

  const onFormSuccess = async () => {
    form.onSuccess && (await form.onSuccess());
    closeModal();
  };

  // a to cope with DSFR constraints
  useIsModalOpen(modal, {
    onConceal: () => closeModal(),
  });

  if (isOpen) {
    modal.open();
  }

  return (
    <modal.Component title={title}>
      <Form {...form} onSuccess={onFormSuccess}>
        {form.children}
        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <Button priority="secondary" onClick={handleRejectClick} type="button">
            {rejectButtonLabel}
          </Button>
          <SubmitButton>{acceptButtonLabel}</SubmitButton>
        </div>
      </Form>
    </modal.Component>
  );
};
