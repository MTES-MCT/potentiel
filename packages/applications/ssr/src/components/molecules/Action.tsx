import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

import { useFormState } from 'react-dom';
import { FC, useState } from 'react';
import { formAction } from '@/utils/formAction';

type ActionProps = {
  name: string;
  description: string;
  form: {
    id: string;
    action: ReturnType<typeof formAction>;
    children: React.ReactNode;
  };
};

export const Action: FC<ActionProps> = ({ name, description, form }) => {
  const [modal, _] = useState(
    createModal({
      id: `action-modal-${name}`,
      isOpenedByDefault: false,
    }),
  );
  const [state, formAction] = useFormState(form.action, {
    error: undefined,
    validationErrors: [],
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
        {state.error && <p>{state.error}</p>}
        <form action={formAction} id={form.id}>
          {form.children}
        </form>
      </modal.Component>
    </>
  );
};
