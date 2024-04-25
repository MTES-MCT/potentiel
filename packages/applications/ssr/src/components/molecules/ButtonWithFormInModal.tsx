'use client';

import Button, { ButtonProps } from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { FC, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';
import { SubmitButton } from '../atoms/form/SubmitButton';

type ButtonWithFormInModalProps = {
  name: string;
  description: string;
  form: FormProps;
  prority?: ButtonProps['priority'];
  yesNo?: true;
  widthFull?: true;
};

export const ButtonWithFormInModal: FC<ButtonWithFormInModalProps> = ({
  name,
  prority = 'secondary',
  description,
  form,
  yesNo,
  widthFull,
}) => {
  const [modal, _] = useState(
    createModal({
      id: `action-modal-${name}`,
      isOpenedByDefault: false,
    }),
  );

  return (
    <>
      <Button priority={prority} className={widthFull ? 'w-full' : ''} onClick={() => modal.open()}>
        <span className="mx-auto">{name}</span>
      </Button>

      <modal.Component title={description}>
        <Form {...form}>
          {form.children}

          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <Button priority="secondary">{yesNo ? 'Non' : 'Annuler'}</Button>
            <SubmitButton>{yesNo ? 'Oui' : name}</SubmitButton>
          </div>
        </Form>
      </modal.Component>
    </>
  );
};
