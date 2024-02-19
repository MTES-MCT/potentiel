'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { FC, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';

type ButtonWithFormInModalProps = {
  name: string;
  description: string;
  form: FormProps;
  yesNo?: true;
};

export const ButtonWithFormInModal: FC<ButtonWithFormInModalProps> = ({
  name,
  description,
  form,
  yesNo,
}) => {
  const [modal, _] = useState(
    createModal({
      id: `action-modal-${name}`,
      isOpenedByDefault: false,
    }),
  );

  return (
    <>
      <Button priority="secondary" className="w-full" onClick={() => modal.open()}>
        <span className="mx-auto">{name}</span>
      </Button>

      <modal.Component
        title={description}
        buttons={[
          {
            type: 'button',
            children: yesNo ? 'Non' : 'Annuler',
          },
          {
            type: 'submit',
            nativeButtonProps: {
              className: 'bg-decisions-background-active-blueFrance-defaulttext-white',
              form: form.id,
            },
            children: yesNo ? 'Oui' : name,
            doClosesModal: false,
          },
        ]}
      >
        <Form {...form} />
      </modal.Component>
    </>
  );
};
