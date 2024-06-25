'use client';

import { FC, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';

import { Spinner } from '../Spinner';

export type FormPendingModalProps = {
  id: string;
  title?: string;
  children: React.ReactNode;
};

export const FormPendingModal: FC<FormPendingModalProps> = ({
  id,
  title = 'Traitement en cours',
  children,
}) => {
  const status = useFormStatus();

  const [modal] = useState(
    createModal({
      id: `action-modal-${id}`,
      isOpenedByDefault: status.pending,
    }),
  );

  const isOpen = useIsModalOpen(modal);

  if (status.pending) {
    modal.open();
  } else if (isOpen) {
    modal.close();
  }

  return (
    <modal.Component title={title} concealingBackdrop={false}>
      <div className="flex flex-col items-center mt-5 gap-5">
        <Spinner size="large" />
        <div>{children}</div>
      </div>
    </modal.Component>
  );
};
