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
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

const initialState: DemanderConfirmationAbandonState = {
  error: undefined,
  validationErrors: [],
};

type DemanderConfirmationAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const DemanderConfirmationAbandonForm = ({
  identifiantProjet,
  utilisateur,
}: DemanderConfirmationAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(demanderConfirmationAbandonAction, initialState);

  // if (state.success) {
  //   router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  // }

  console.log(state);

  const modal = createModal({
    id: 'confirm-abandon',
    isOpenedByDefault: false,
  });

  return (
    <>
      <Button priority="secondary" onClick={() => modal.open()}>
        Demander la confirmation de l'abandon
      </Button>

      <modal.Component title="Demander une confirmation d'abandon" concealingBackdrop={true}>
        <form action={formAction} method="post" encType="multipart/form-data">
          {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
          <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          <input type={'hidden'} value={utilisateur.email} name="utilisateur" />

          <Download
            className="mt-8"
            linkProps={{
              href: `/laureat/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`,
            }}
            details="docx"
            label="Télécharger le modèle de réponse"
          />

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

          <ButtonsGroup
            inlineLayoutWhen="always"
            alignment="right"
            buttons={[
              {
                type: 'submit',
                disabled: pending,
                nativeButtonProps: {
                  'aria-disabled': pending,
                  className: 'bg-blue-france-sun-base text-white',
                },
                children: 'Demander la confirmation',
              },
              {
                type: 'button',
                priority: 'secondary',
                onClick: () => modal.close(),
                disabled: pending,
                nativeButtonProps: {
                  'aria-disabled': pending,
                },
                children: 'Annuler',
              },
            ]}
          />
        </form>
      </modal.Component>
    </>
  );
};
