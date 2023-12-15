'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Download } from '@codegouvfr/react-dsfr/Download';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import {
  AccorderAbandonSansRecandidatureState,
  accorderAbandonSansRecandidatureAction,
} from './accorderAbandonSansRecandidature.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import { encodeParameter } from '@/utils/encodeParameter';

import { Form } from '@/components/molecules/Form';

const initialState: AccorderAbandonSansRecandidatureState = {
  error: undefined,
  validationErrors: [],
};

type AccorderAbandonSansRecandidatureFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const AccorderAbandonSansRecandidature = ({
  identifiantProjet,
  utilisateur,
}: AccorderAbandonSansRecandidatureFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(accorderAbandonSansRecandidatureAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
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

      <Upload
        label="Téléverser une réponse signée"
        hint="au format pdf"
        state={state.validationErrors.includes('reponseSignee') ? 'error' : 'default'}
        stateRelatedMessage="Réponse signée obligatoire"
        disabled={pending}
        nativeInputProps={{
          name: 'reponseSignee',
          required: true,
          'aria-required': true,
        }}
        className="mb-4"
      />

      <Download
        linkProps={{
          href: `/laureat/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`,
        }}
        details="docx"
        label="Télécharger le modèle de réponse"
        className="mb-4"
      />
    </Form>
  );
};
