'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import {
  AnnulerAbandonState,
  annulerAbandonAction,
} from '@/app/laureat/[identifiant]/abandon/annuler/annuler.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

const initialState: AnnulerAbandonState = {
  error: undefined,
  validationErrors: [],
};

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const AnnulerAbandonForm = ({ identifiantProjet, utilisateur }: AnnulerAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(annulerAbandonAction, initialState);

  if (state.success) {
    router.back();
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
        className="bg-blue-france-sun-base text-white mt-6"
      >
        Annuler l'abandon
      </Button>
    </form>
  );
};
