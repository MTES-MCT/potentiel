'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { RejeterAbandonState, rejeterAbandonAction } from './rejeterAbandon.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { encodeParameter } from '@/utils/encodeParameter';
import Download from '@codegouvfr/react-dsfr/Download';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { Form } from '@/components/molecules/Form';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

const initialState: RejeterAbandonState = {
  error: undefined,
  validationErrors: [],
};

type RejeterAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

const modal = createModal({
  id: 'rejeter-abandon',
  isOpenedByDefault: false,
});

export const RejeterAbandon = ({ identifiantProjet, utilisateur }: RejeterAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(rejeterAbandonAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  }

  return (
    <>
      <Button priority="secondary" onClick={() => modal.open()}>
        Rejeter la demande
      </Button>
      <modal.Component title="Rejeter une demande d'abandon">
        <Form action={formAction} method="post" encType="multipart/form-data">
          {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
          <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          <input type={'hidden'} value={utilisateur.email} name="utilisateur" />

          <Download
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
            className="mb-4"
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
                children: 'Rejeter',
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
        </Form>
      </modal.Component>
    </>
  );
};
