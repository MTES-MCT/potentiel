'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import {
  AjouterGestionnaireRéseauState,
  ajouterGestionnaireRéseauAction,
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
  const [state, formAction] = useFormState(ajouterGestionnaireRéseauAction, initialState);

  if (state.success) {
    router.push('/reseau/gestionnaires');
  }

  return (
    <Form action={formAction} method="post" encType="multipart/form-data">
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}

      <Input
        textArea
        label="Code EIC ou gestionnaire"
        id="identifiantGestionnaireReseau"
        nativeTextAreaProps={{ name: 'identifiantGestionnaireReseau', disabled: pending }}
        state={
          state.validationErrors.includes('identifiantGestionnaireReseau') ? 'error' : 'default'
        }
        stateRelatedMessage="Code EIC ou gestionnaire à préciser"
      />

      <Input
        textArea
        label="Raison sociale"
        id="raisonSociale"
        nativeTextAreaProps={{ name: 'raisonSociale', disabled: pending }}
        state={state.validationErrors.includes('raisonSociale') ? 'error' : 'default'}
        stateRelatedMessage="Raison sociale à préciser"
      />

      <Input
        textArea
        label="Format de l'identifiant du dossier de raccordement"
        id="format"
        nativeTextAreaProps={{ name: 'format', disabled: pending }}
        state={state.validationErrors.includes('format') ? 'error' : 'default'}
        stateRelatedMessage="Format à préciser"
        hintText="Exemple : XXX-RP-AAAA-999999"
      />

      <Input
        textArea
        label="Aide à la saisie de l'identifiant du dossier de raccordement"
        id="legende"
        nativeTextAreaProps={{ name: 'legende', disabled: pending }}
        state={state.validationErrors.includes('legende') ? 'error' : 'default'}
        stateRelatedMessage="Légende à préciser"
        hintText="Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de 0 à 9"
      />

      <Input
        textArea
        label="Expression régulière"
        id="expressionReguliere"
        nativeTextAreaProps={{ name: 'expressionReguliere', disabled: pending }}
        state={state.validationErrors.includes('expressionReguliere') ? 'error' : 'default'}
        stateRelatedMessage="Raison sociale à préciser"
        hintText="Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}"
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
    </Form>
  );
};
