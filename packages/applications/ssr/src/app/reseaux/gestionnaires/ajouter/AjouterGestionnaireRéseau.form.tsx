'use client';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  ajouterGestionnaireRéseauAction,
  AjouterGestionnaireRéseauFormKeys,
} from './ajouterGestionnaireRéseau.action';

export const AjouterGestionnaireRéseauForm = () => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AjouterGestionnaireRéseauFormKeys>
  >({});

  return (
    <Form
      action={ajouterGestionnaireRéseauAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitButtonLabel: 'Ajouter',
      }}
    >
      <Input
        label="Code EIC ou gestionnaire"
        id="identifiantGestionnaireReseau"
        nativeInputProps={{ name: 'identifiantGestionnaireReseau' }}
        state={validationErrors['identifiantGestionnaireReseau'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['identifiantGestionnaireReseau']}
      />

      <Input
        label="Raison sociale"
        id="raisonSociale"
        nativeInputProps={{ name: 'raisonSociale' }}
        state={validationErrors['raisonSociale'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raisonSociale']}
      />

      <Input
        label="Format de l'identifiant du dossier de raccordement (optionnel)"
        id="format"
        nativeInputProps={{ name: 'format' }}
        state={validationErrors['format'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['format']}
        hintText="Exemple : XXX-RP-AAAA-999999"
      />

      <Input
        label="Aide à la saisie de l'identifiant du dossier de raccordement (optionnel)"
        id="legende"
        nativeInputProps={{ name: 'legende' }}
        state={validationErrors['legende'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['legende']}
        hintText="Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de 0 à 9"
      />

      <Input
        label="Expression régulière (optionnel)"
        id="expressionReguliere"
        nativeInputProps={{ name: 'expressionReguliere' }}
        state={validationErrors['expressionReguliere'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['expressionReguliere']}
        hintText="Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}"
      />
    </Form>
  );
};
