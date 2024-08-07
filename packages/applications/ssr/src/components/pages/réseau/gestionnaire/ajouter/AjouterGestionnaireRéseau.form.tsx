'use client';
import { useRouter } from 'next/navigation';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Form } from '@/components/atoms/form/Form';

import { ajouterGestionnaireRéseauAction } from './ajouterGestionnaireRéseau.action';

export const AjouterGestionnaireRéseauForm = () => {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  return (
    <Form
      action={ajouterGestionnaireRéseauAction}
      method="POST"
      encType="multipart/form-data"
      onSuccess={() => router.push(Routes.Gestionnaire.lister)}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
    >
      <Input
        label="Code EIC ou gestionnaire"
        id="identifiantGestionnaireReseau"
        nativeInputProps={{ name: 'identifiantGestionnaireReseau' }}
        state={validationErrors.includes('identifiantGestionnaireReseau') ? 'error' : 'default'}
        stateRelatedMessage="Code EIC ou gestionnaire à préciser"
      />

      <Input
        label="Raison sociale"
        id="raisonSociale"
        nativeInputProps={{ name: 'raisonSociale' }}
        state={validationErrors.includes('raisonSociale') ? 'error' : 'default'}
        stateRelatedMessage="Raison sociale à préciser"
      />

      <Input
        label="Format de l'identifiant du dossier de raccordement (optionnel)"
        id="format"
        nativeInputProps={{ name: 'format' }}
        state={validationErrors.includes('format') ? 'error' : 'default'}
        stateRelatedMessage="Format à préciser"
        hintText="Exemple : XXX-RP-AAAA-999999"
      />

      <Input
        label="Aide à la saisie de l'identifiant du dossier de raccordement (optionnel)"
        id="legende"
        nativeInputProps={{ name: 'legende' }}
        state={validationErrors.includes('legende') ? 'error' : 'default'}
        stateRelatedMessage="Légende à préciser"
        hintText="Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de 0 à 9"
      />

      <Input
        label="Expression régulière (optionnel)"
        id="expressionReguliere"
        nativeInputProps={{ name: 'expressionReguliere' }}
        state={validationErrors.includes('expressionReguliere') ? 'error' : 'default'}
        stateRelatedMessage="expression régulière à préciser"
        hintText="Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}"
      />

      <SubmitButton>Envoyer</SubmitButton>
    </Form>
  );
};
