'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { ConfirmerAbandonState, confirmerAbandonAction } from './confirmerAbandon.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { encodeParameter } from '@/utils/encodeParameter';
import { Form } from '@/components/molecules/Form';

const initialState: ConfirmerAbandonState = {
  error: undefined,
  validationErrors: [],
};

type ConfirmerAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

const modal = createModal({
  id: 'confirm-confirmation',
  isOpenedByDefault: false,
});

export const ConfirmerAbandon = ({ identifiantProjet, utilisateur }: ConfirmerAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(confirmerAbandonAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  }

  return (
    <>
      <Button priority="secondary" onClick={() => modal.open()}>
        Confirmer l'abandon
      </Button>

      <modal.Component
        title="Confirmer un abandon"
        buttons={[
          {
            type: 'button',
            onClick: () => modal.close(),
            disabled: pending,
            nativeButtonProps: {
              'aria-disabled': pending,
            },
            children: 'Non',
          },
          {
            type: 'submit',
            disabled: pending,
            nativeButtonProps: {
              'aria-disabled': pending,
              className: 'bg-blue-france-sun-base text-white',
              form: 'confirmer-abandon-form',
            },
            children: 'Oui',
          },
        ]}
      >
        {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
        <div className="flex flex-col gap-5">
          <p className="mt-3">Êtes-vous sûr de vouloir confirmer cet abandon ?</p>
          <Form action={formAction} method="post" id="confirmer-abandon-form">
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
          </Form>
        </div>
      </modal.Component>
    </>
  );
};
