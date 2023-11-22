'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import {
  DemanderConfirmationAbandonState,
  demanderConfirmationAbandonAction,
} from '@/app/laureat/[identifiant]/abandon/instruire/demanderConfirmation.action';
import { Utilisateur } from '@/utils/getUtilisateur';

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
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(demanderConfirmationAbandonAction, initialState);

  return (
    <form action={formAction} method="post" encType="multipart/form-data">
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <input type={'hidden'} value={utilisateur.email} name="utilisateurValue" />
      <Upload
        label="Téléverser une réponse signée"
        hint="au format pdf"
        state={state.validationErrors.includes('reponseSignee') ? 'error' : 'default'}
        stateRelatedMessage="Réponse signée obligatoire"
        nativeInputProps={{
          name: 'reponseSignee',
        }}
        className="mb-4"
      />
      <ButtonsGroup
        inlineLayoutWhen="always"
        alignment="left"
        buttons={[
          {
            children: 'Demander confirmation',
            type: 'submit',
            priority: 'primary',
            nativeButtonProps: {
              'aria-disabled': pending,
            },
            className: 'bg-blue-france-sun-base text-white',
          },
          {
            children: 'Retour à la liste',
            linkProps: {
              href: '/laureat/abandon',
            },
            priority: 'secondary',
          },
        ]}
      />
    </form>
  );
};
