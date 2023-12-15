'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { AnnulerAbandonState, annulerAbandonAction } from './annulerAbandon.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';

const initialState: AnnulerAbandonState = {
  error: undefined,
  validationErrors: [],
};

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const AnnulerAbandon = ({ identifiantProjet, utilisateur }: AnnulerAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(annulerAbandonAction, initialState);

  if (state.success) {
    router.back();
  }

  return (
    <>
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <div className="flex flex-col gap-5">
        <p className="mt-3">Êtes-vous sûr de vouloir annuler cet abandon ?</p>
        <form action={formAction} method="post" id="annuler-abandon-form">
          <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
        </form>
      </div>
    </>
  );
};
