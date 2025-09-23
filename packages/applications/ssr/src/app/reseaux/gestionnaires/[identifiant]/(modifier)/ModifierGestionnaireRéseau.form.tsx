'use client';
import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { ExpressionRegulière, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  modifierGestionnaireRéseauAction,
  ModifierGestionnaireRéseauFormKeys,
} from './modifierGestionnaireRéseau.action';

export type ModifierGestionnaireRéseauFormProps =
  PlainType<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>;

export const ModifierGestionnaireRéseauForm: FC<ModifierGestionnaireRéseauFormProps> = ({
  identifiantGestionnaireRéseau,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  contactEmail,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierGestionnaireRéseauFormKeys>
  >({});

  // Ici on match bind pour montrer un cas d'utilisation simple vu que c'est
  // la première mise en place de Option et ValueType en mode Isomorphique.
  // Utiliser bind uniquement si besoin d'une fonctionnalité avancée du ValueType (exemple: comparaison de date)
  const contactEmailValue = Option.match(contactEmail)
    .some((email) => {
      const emailValueType = Email.bind(email);
      return emailValueType.formatter();
    })
    .none(() => '');

  const expressionReguliereValue = ExpressionRegulière.bind(expressionReguliere).formatter();

  const identifiantGestionnaireReseauValue = GestionnaireRéseau.IdentifiantGestionnaireRéseau.bind(
    identifiantGestionnaireRéseau,
  ).formatter();

  return (
    <Form
      action={modifierGestionnaireRéseauAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitButtonLabel: 'Modifier',
      }}
    >
      <div className="mb-6">
        <label>Code EIC ou Gestionnaire: {identifiantGestionnaireReseauValue}</label>
      </div>

      <input
        type={'hidden'}
        value={identifiantGestionnaireReseauValue}
        name="identifiantGestionnaireReseau"
      />

      <Input
        label="Raison sociale"
        id="raisonSociale"
        nativeInputProps={{
          name: 'raisonSociale',
          defaultValue: raisonSociale,
        }}
        state={validationErrors['raisonSociale'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raisonSociale']}
      />

      <Input
        label="Courriel de contact"
        id="contactEmail"
        nativeInputProps={{
          name: 'contactEmail',
          defaultValue: contactEmailValue,
        }}
        state={validationErrors['contactEmail'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['contactEmail']}
      />

      <Input
        label="Format de l'identifiant du dossier de raccordement (optionnel)"
        id="format"
        nativeInputProps={{
          name: 'format',
          defaultValue: Option.match(format)
            .some((format) => format)
            .none(() => ''),
        }}
        state={validationErrors['format'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['format']}
        hintText="Exemple : XXX-RP-AAAA-999999"
      />

      <Input
        label="Aide à la saisie de l'identifiant du dossier de raccordement (optionnel)"
        id="legende"
        nativeInputProps={{
          name: 'legende',
          defaultValue: Option.match(légende)
            .some((légende) => légende)
            .none(() => ''),
        }}
        state={validationErrors['legende'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['legende']}
        hintText="Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de 0 à 9"
      />

      <Input
        label="Expression régulière (optionnel)"
        id="expressionReguliere"
        nativeInputProps={{
          name: 'expressionReguliere',
          defaultValue: expressionReguliereValue,
        }}
        state={validationErrors['expressionReguliere'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['expressionReguliere']}
        hintText="Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}"
      />
    </Form>
  );
};
