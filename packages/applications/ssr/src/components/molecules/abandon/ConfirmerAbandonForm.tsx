'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import {
  ConfirmerAbandonState,
  confirmerAbandonAction,
} from '@/app/laureat/[identifiant]/abandon/confirmerAbandon.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

const initialState: ConfirmerAbandonState = {
  error: undefined,
  validationErrors: [],
};

type RejeterAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const ConfirmerAbandonForm = ({
  identifiantProjet,
  utilisateur,
}: RejeterAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(confirmerAbandonAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeURIComponent(identifiantProjet)}/abandon`);
  }

  return (
    <form action={formAction} method="post">
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
      <Button
        type="submit"
        priority="primary"
        nativeButtonProps={{
          'aria-disabled': pending,
          disabled: pending,
          onClick: (event) => {
            confirm("Êtes-vous sûr de vouloir confirmer l'abandon ?") || event.preventDefault();
          },
        }}
        className="bg-blue-france-sun-base text-white"
      >
        Confirmer l'abandon
      </Button>
    </form>
  );
};
