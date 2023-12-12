'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import {
  AccorderAbandonAvecRecandidatureState,
  accorderAbandonAvecRecandidatureAction,
} from './accorderAbandonAvecRecandidature.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

import { Form } from '@/components/molecules/Form';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

const initialState: AccorderAbandonAvecRecandidatureState = {
  error: undefined,
  validationErrors: [],
};

type AccorderAbandonAvecRecandidatureFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

const modal = createModal({
  id: 'accorder-abandon-avec-recandidature',
  isOpenedByDefault: false,
});

export const AccorderAbandonAvecRecandidature = ({
  identifiantProjet,
  utilisateur,
}: AccorderAbandonAvecRecandidatureFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(accorderAbandonAvecRecandidatureAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeURIComponent(identifiantProjet)}/abandon`);
  }

  return (
    <>
      <Button priority="secondary" onClick={() => modal.open()}>
        Accorder la demande
      </Button>
      <modal.Component title="Accorder un abandon avec recandidature">
        <Form action={formAction} method="post" encType="multipart/form-data">
          {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
          <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          <input type={'hidden'} value={utilisateur.email} name="utilisateur" />

          <ButtonsGroup
            inlineLayoutWhen="always"
            alignment="right"
            buttons={[
              {
                type: 'submit',
                disabled: pending,
                nativeButtonProps: {
                  'aria-disabled': pending,
                  className: 'bg-blue-france-sun-base text-white',
                },
                children: 'Accorder',
              },
              {
                type: 'button',
                priority: 'secondary',
                onClick: () => modal.close(),
                disabled: pending,
                nativeButtonProps: {
                  'aria-disabled': pending,
                },
                children: 'Annuler',
              },
            ]}
          />
        </Form>
      </modal.Component>
    </>
  );
};
