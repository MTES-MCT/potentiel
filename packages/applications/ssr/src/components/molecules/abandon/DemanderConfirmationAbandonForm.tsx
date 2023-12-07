'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import {
  DemanderConfirmationAbandonState,
  demanderConfirmationAbandonAction,
} from '@/app/laureat/[identifiant]/abandon/instruire/demanderConfirmation.action';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { encodeParameter } from '@/utils/encodeParameter';
import Download from '@codegouvfr/react-dsfr/Download';

const initialState: DemanderConfirmationAbandonState = {
  error: undefined,
  validationErrors: [],
};

type DemanderConfirmationAbandonFormProps = {
  identifiantProjet: string;
};

export const DemanderConfirmationAbandonForm = ({
  identifiantProjet,
}: DemanderConfirmationAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(demanderConfirmationAbandonAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  }

  return (
    <form action={formAction} method="post" encType="multipart/form-data">
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <Download
        linkProps={{
          href: `/laureat/${encodeParameter(
            identifiantProjet,
          )}/abandon/instruire/telecharger-modele-reponse`,
        }}
        details="docx"
        label="Télécharger le modèle de réponse"
      />

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
        Demander confirmation
      </Button>
    </form>
  );
};
