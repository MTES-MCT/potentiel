'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import Alert from '@codegouvfr/react-dsfr/Alert';
import {
  AnnulerAbandonState,
  annulerAbandonAction,
} from '@/app/laureat/[identifiant]/abandon/annuler/annuler.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

const initialState: AnnulerAbandonState = {
  error: undefined,
  validationErrors: [],
};

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

const modal = createModal({
  id: 'confirm-cancelation',
  isOpenedByDefault: false,
});

export const AnnulerAbandonForm = ({ identifiantProjet, utilisateur }: AnnulerAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(annulerAbandonAction, initialState);

  if (state.success) {
    router.back();
  }

  return (
    <>
      <Button priority="secondary" onClick={() => modal.open()}>
        Annuler l'abandon
      </Button>

      <modal.Component title="Annuler">
        {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
        <div className="flex flex-col gap-5">
          <p className="mt-3">Êtes-vous sûr de vouloir annuler cet abandon ?</p>
          <form action={formAction} method="post">
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
            <ButtonsGroup
              inlineLayoutWhen="always"
              alignment="right"
              buttons={[
                {
                  type: 'submit',
                  nativeButtonProps: {
                    'aria-disabled': pending,
                    disabled: pending,
                    className: 'bg-blue-france-sun-base text-white',
                  },
                  children: 'Oui',
                },
                {
                  type: 'button',
                  priority: 'secondary',
                  onClick: () => modal.close(),
                  nativeButtonProps: {
                    'aria-disabled': pending,
                    disabled: pending,
                  },
                  children: 'Non',
                },
              ]}
            />
          </form>
        </div>
      </modal.Component>
    </>
  );
};
