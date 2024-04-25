'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import { Dispatch, FC, SetStateAction, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';
import { SubmitButton } from '../atoms/form/SubmitButton';

export type ModalWithFormProps = {
  title: string;
  form: FormProps;
  rejectButtonLabel: string;
  acceptButtonLabel: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const ModalWithForm: FC<ModalWithFormProps> = ({
  title,
  form,
  rejectButtonLabel,
  acceptButtonLabel,
  isOpen,
  setIsOpen,
}) => {
  const [modal, _] = useState(
    createModal({
      id: `action-modal-${title}`,
      isOpenedByDefault: false,
    }),
  );

  const closeModal = () => {
    setIsOpen(false);
    modal.close();
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
      <Form {...form}>
        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <Button priority="secondary" onClick={() => closeModal()}>
            {rejectButtonLabel}
          </Button>
          <SubmitButton>{acceptButtonLabel}</SubmitButton>
        </div>
      </Form>
    </modal.Component>
  );
};
