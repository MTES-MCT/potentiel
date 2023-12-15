'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import {
  AccorderAbandonAvecRecandidatureState,
  accorderAbandonAvecRecandidatureAction,
} from './accorderAbandonAvecRecandidature.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';

import { Form } from '@/components/molecules/Form';

const initialState: AccorderAbandonAvecRecandidatureState = {
  error: undefined,
  validationErrors: [],
};

type AccorderAbandonAvecRecandidatureFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

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
    <Form
      action={formAction}
      method="post"
      encType="multipart/form-data"
      id="accorder-abandon-form"
    >
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
    </Form>
  );
};
