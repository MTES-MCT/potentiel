'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import {
  AccorderAbandonAvecRecandidatureState,
  accorderAbandonAvecRecandidatureAction,
} from '@/app/laureat/[identifiant]/abandon/instruire/accorderAvecRecandidature.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

const initialState: AccorderAbandonAvecRecandidatureState = {
  error: undefined,
  validationErrors: [],
};

type AccorderAbandonAvecRecandidatureFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const AccorderAbandonAvecRecandidatureForm = ({
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
    <form action={formAction} method="post" encType="multipart/form-data">
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <input type={'hidden'} value={utilisateur.email} name="utilisateur" />

      <Button
        type="submit"
        priority="primary"
        nativeButtonProps={{
          'aria-disabled': pending,
          disabled: pending,
        }}
        className="bg-blue-france-sun-base text-white"
      >
        Accorder l'abandon
      </Button>
    </form>
  );
};
