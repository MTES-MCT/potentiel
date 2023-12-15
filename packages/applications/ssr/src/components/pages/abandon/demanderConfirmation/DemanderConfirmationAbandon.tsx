'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import {
  DemanderConfirmationAbandonState,
  demanderConfirmationAbandonAction,
} from './demanderConfirmation.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { encodeParameter } from '@/utils/encodeParameter';
import Download from '@codegouvfr/react-dsfr/Download';

import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { Form } from '@/components/molecules/Form';

const initialState: DemanderConfirmationAbandonState = {
  error: undefined,
  validationErrors: [],
};

type DemanderConfirmationAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

const modal = createModal({
  id: 'demande-confirmation-abandon',
  isOpenedByDefault: false,
});

export const DemanderConfirmationAbandon = ({
  identifiantProjet,
  utilisateur,
}: DemanderConfirmationAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(demanderConfirmationAbandonAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  }

  return (
    <>
      <Button priority="secondary" className="w-full" onClick={() => modal.open()}>
        <span className="mx-auto">Demander une confirmation</span>
      </Button>

      <modal.Component
        title="Demander une confirmation d'abandon"
        buttons={[
          {
            type: 'button',
            disabled: pending,
            priority: 'secondary',
            nativeButtonProps: {
              'aria-disabled': pending,
            },
            children: 'Annuler',
          },
          {
            type: 'submit',
            disabled: pending,
            priority: 'primary',
            nativeButtonProps: {
              'aria-disabled': pending,
              className: 'bg-blue-france-sun-base text-white',
              form: 'demande-confirmation-abandon-form',
            },
            children: 'Demander une confirmation',
          },
        ]}
      >
        <Form
          action={formAction}
          method="post"
          encType="multipart/form-data"
          id="demande-confirmation-abandon-form"
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
            className="mb-8"
          />
        </Form>

        <Download
          linkProps={{
            href: `/laureat/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`,
          }}
          details="docx"
          label="Télécharger le modèle de réponse"
          className="mb-4"
        />
      </modal.Component>
    </>
  );
};
