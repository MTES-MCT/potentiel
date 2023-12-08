'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { ConfirmerAbandonState, confirmerAbandonAction } from './confirmerAbandon.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import { encodeParameter } from '@/utils/encodeParameter';

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

export const ConfirmerAbandonForm = ({
  identifiantProjet,
  utilisateur,
}: ConfirmerAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(confirmerAbandonAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  }

  return (
    <>
      <Button
        priority="primary"
        className="bg-blue-france-sun-base text-white"
        onClick={() => modal.open()}
      >
        Confirmer l'abandon
      </Button>

      <modal.Component title="Confirmer">
        {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
        <div className="flex flex-col gap-5">
          <p className="mt-3">Êtes-vous sûr de vouloir confirmer cet abandon ?</p>
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
