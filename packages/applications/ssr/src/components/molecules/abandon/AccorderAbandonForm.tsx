'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import {
  AccorderAbandonState,
  accorderAbandonAction,
} from '@/app/laureat/[identifiant]/abandon/instruire/accorder.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

const initialState: AccorderAbandonState = {
  error: undefined,
  validationErrors: [],
};

type AccorderAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const AccorderAbandonForm = ({
  identifiantProjet,
  utilisateur,
}: AccorderAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(accorderAbandonAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeURIComponent(identifiantProjet)}/abandon`);
  }

  return (
    <form action={formAction} method="post" encType="multipart/form-data">
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
      <Upload
        label="Téléverser une réponse signée"
        hint="au format pdf"
        state={state.validationErrors.includes('reponseSignee') ? 'error' : 'default'}
        stateRelatedMessage="Réponse signée obligatoire"
        nativeInputProps={{
          name: 'reponseSignee',
          disabled: pending,
        }}
        className="mb-4"
      />
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
