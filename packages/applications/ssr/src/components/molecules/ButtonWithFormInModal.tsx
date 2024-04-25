'use client';

import Button, { ButtonProps } from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { FC, ReactNode, useState } from 'react';

import { Form, FormProps } from '../atoms/form/Form';
import { SubmitButton } from '../atoms/form/SubmitButton';

type ButtonWithFormInModalProps = ButtonProps.Common & {
  modal: {
    title: string;
    form: FormProps;
  } & (
    | {
        yesNo: true;
      }
    | {
        yesNo?: undefined;
        submitButton: { children: ReactNode };
      }
  );
  children: ReactNode;
};

export const ButtonWithFormInModal: FC<ButtonWithFormInModalProps> = (props) => {
  const { modal: modalProps, children, ...buttonProps } = props;

  const [modal, _] = useState(
    createModal({
      id: `action-modal-${name}`,
      isOpenedByDefault: false,
    }),
  );

  return (
    <>
      <Button {...buttonProps} onClick={() => modal.open()}>
        {children}
      </Button>

      <modal.Component title={modalProps.title}>
        <Form {...modalProps.form}>
          {modalProps.form.children}

          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <Button priority="secondary">{modalProps.yesNo ? 'Non' : 'Annuler'}</Button>
            <SubmitButton>
              {modalProps.yesNo ? 'Oui' : modalProps.submitButton.children}
            </SubmitButton>
          </div>
        </Form>
      </modal.Component>
    </>
  );
};
