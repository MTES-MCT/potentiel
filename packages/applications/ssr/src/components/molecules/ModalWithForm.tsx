'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { FC, useEffect, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';
import { SubmitButton } from '../atoms/form/SubmitButton';

export type ModalWithFormProps = {
  title: string;
  form: FormProps;
  rejectButtonLabel: string;
  acceptButtonLabel: string;
  isOpen: boolean;
};

export const ModalWithForm: FC<ModalWithFormProps> = ({
  title,
  form,
  rejectButtonLabel,
  acceptButtonLabel,
  isOpen,
}) => {
  const [modal, _] = useState(
    createModal({
      id: `action-modal-${name}`,
      isOpenedByDefault: isOpen,
    }),
  );

  useEffect(() => {
    if (isOpen) {
      modal.open();
    } else {
      modal.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <modal.Component title={title}>
      <Form {...form}>
        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <Button priority="secondary">{rejectButtonLabel}</Button>
          <SubmitButton>{acceptButtonLabel}</SubmitButton>
        </div>
      </Form>
    </modal.Component>
  );
};
