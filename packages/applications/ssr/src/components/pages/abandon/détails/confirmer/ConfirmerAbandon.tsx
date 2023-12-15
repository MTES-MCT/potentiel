'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { ConfirmerAbandonState, confirmerAbandonAction } from './confirmerAbandon.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import { encodeParameter } from '@/utils/encodeParameter';

const initialState: ConfirmerAbandonState = {
  error: undefined,
  validationErrors: [],
};

type ConfirmerAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const ConfirmerAbandon = ({ identifiantProjet, utilisateur }: ConfirmerAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(confirmerAbandonAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  }

  return (
    <>
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <div className="flex flex-col gap-5">
        <p className="mt-3">Êtes-vous sûr de vouloir confirmer cet abandon ?</p>
        <form action={formAction} method="post" id="confirmer-abandon-form">
          <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
        </form>
      </div>
    </>
  );
};
