'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { AnnulerAbandonState, annulerAbandonAction } from './annulerAbandon.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { Form } from '@/components/molecules/Form';

const initialState: AnnulerAbandonState = {
  error: undefined,
  validationErrors: [],
};

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

const modal = createModal({
  id: 'annuler-abandon',
  isOpenedByDefault: false,
});

export const AnnulerAbandon = ({ identifiantProjet, utilisateur }: AnnulerAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(annulerAbandonAction, initialState);

  if (state.success) {
    router.back();
  }

  return (
    <>
      <Button priority="tertiary no outline" onClick={() => modal.open()}>
        Annuler l'abandon
      </Button>

      <modal.Component
        title="Annuler un abandon"
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
              form: 'annuler-abandon-form',
            },
            children: 'Oui',
          },
        ]}
      >
        {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
        <div className="flex flex-col gap-5">
          <p className="mt-3">Êtes-vous sûr de vouloir annuler cet abandon ?</p>
          <Form action={formAction} method="post" id="annuler-abandon-form">
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
          </Form>
        </div>
      </modal.Component>
    </>
  );
};
