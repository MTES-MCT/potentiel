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
import Button from '@codegouvfr/react-dsfr/Button';
import { encodeParameter } from '@/utils/encodeParameter';

import { Form } from '@/components/molecules/Form';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

const initialState: AccorderAbandonSansRecandidatureState = {
  error: undefined,
  validationErrors: [],
};

type AccorderAbandonSansRecandidatureFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

const modal = createModal({
  id: 'accorder-abandon-sans-recandidature',
  isOpenedByDefault: false,
});

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
    <>
      <Button priority="secondary" className="w-full" onClick={() => modal.open()}>
        <span className="mx-auto">Accorder</span>
      </Button>

      <modal.Component
        title="Accorder un abandon sans recandidature"
        buttons={[
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
          {
            type: 'submit',
            disabled: pending,
            priority: 'primary',
            nativeButtonProps: {
              'aria-disabled': pending,
              className: 'bg-blue-france-sun-base text-white',
              form: 'accorder-abandon-sans-recandidature-form',
            },
            children: 'Accorder',
          },
        ]}
      >
        <Download
          linkProps={{
            href: `/laureat/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`,
          }}
          details="docx"
          label="Télécharger le modèle de réponse"
        />

        <Form
          action={formAction}
          method="post"
          encType="multipart/form-data"
          id="accorder-abandon-sans-recandidature-form"
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
        </Form>
      </modal.Component>
    </>
  );
};
