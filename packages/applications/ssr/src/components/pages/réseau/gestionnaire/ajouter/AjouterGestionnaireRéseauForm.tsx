'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import {
  AjouterGestionnaireRéseauState,
  demanderAbandonAction,
} from './ajouterGestionnaireRéseau.action';
import { Form } from '@/components/molecules/Form';
import Input from '@codegouvfr/react-dsfr/Input';

const initialState: AjouterGestionnaireRéseauState = {
  error: undefined,
  validationErrors: [],
};

export const AjouterGestionnaireRéseauForm = () => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(demanderAbandonAction, initialState);

  if (state.success) {
    router.push('/reseau/gestionnaire');
  }

  return (
    <Form action={formAction} method="post" encType="multipart/form-data">
      <>
        {state.error && <Alert severity="error" title={state.error} className="mb-4" />}

        <Input
          textArea
          label="Code EIC ou gestionnaire"
          id="codeEIC"
          nativeTextAreaProps={{ name: 'codeEIC', disabled: pending }}
          state={state.validationErrors.includes('codeEIC') ? 'error' : 'default'}
          stateRelatedMessage="Code EIC à préciser"
        />

        <Input
          textArea
          label="Raison sociale"
          id="raisonSociale"
          nativeTextAreaProps={{ name: 'raisonSociale', disabled: pending }}
          state={state.validationErrors.includes('raisonSociale') ? 'error' : 'default'}
          stateRelatedMessage="Raison sociale"
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
          Envoyer
        </Button>
      </>
    </Form>
  );
};
