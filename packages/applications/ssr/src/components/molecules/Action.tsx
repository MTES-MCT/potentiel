import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

type ActionProps = {
  name: string;
  description: string;
  form: {
    id: string;
    component: React.ReactNode;
  };
};

export const Action: FC<ActionProps> = ({ name, description, form }) => {
  const modal = createModal({
    id: `action-modal-${name}`,
    isOpenedByDefault: false,
  });

  const pending = false;

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
            disabled: pending,
            nativeButtonProps: {
              'aria-disabled': pending,
            },
            children: 'Annuler',
          },
          {
            type: 'submit',
            disabled: pending,
            nativeButtonProps: {
              className: 'bg-blue-france-sun-base text-white',
              'aria-disabled': pending,
              form: form.id,
            },
            children: name,
            doClosesModal: false,
          },
        ]}
      >
        {form.component}
      </modal.Component>
    </>
  );
};
