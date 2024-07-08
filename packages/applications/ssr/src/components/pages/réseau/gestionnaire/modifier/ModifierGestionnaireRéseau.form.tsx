'use client';
import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { ExpressionRegulière, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { modifierGestionnaireRéseauAction } from './modifierGestionnaireRéseau.action';

export type ModifierGestionnaireRéseauFormProps =
  PlainType<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>;

export const ModifierGestionnaireRéseauForm: FC<ModifierGestionnaireRéseauFormProps> = ({
  identifiantGestionnaireRéseau,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  contactEmail,
}) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

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
      method="post"
      encType="multipart/form-data"
      onSuccess={() => router.push(Routes.Gestionnaire.lister)}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
    >
      <div className="mb-6">
        <label>Code EIC ou Gestionnaire: {identifiantGestionnaireReseauValue}</label>
      </div>

      <input
        type={'hidden'}
        value={identifiantGestionnaireReseauValue}
        name="identifiantGestionnaireReseau"
      />

      <input type={'hidden'} value={contactEmailValue} name="contactEmail" />

      <Input
        label="Raison sociale"
        id="raisonSociale"
        nativeInputProps={{
          name: 'raisonSociale',
          defaultValue: raisonSociale,
        }}
        state={validationErrors.includes('raisonSociale') ? 'error' : 'default'}
        stateRelatedMessage="Raison sociale à préciser"
      />

      <Input
        label="Courriel de contact"
        id="contactEmail"
        nativeInputProps={{
          name: 'contactEmail',
          defaultValue: contactEmailValue,
        }}
        state={validationErrors.includes('contactEmail') ? 'error' : 'default'}
        stateRelatedMessage="Contact à préciser"
      />

      <Input
        label="Format de l'identifiant du dossier de raccordement (optionnel)"
        id="format"
        nativeInputProps={{
          name: 'format',
          defaultValue: format,
        }}
        state={validationErrors.includes('format') ? 'error' : 'default'}
        stateRelatedMessage="Format à préciser"
        hintText="Exemple : XXX-RP-AAAA-999999"
      />

      <Input
        label="Aide à la saisie de l'identifiant du dossier de raccordement (optionnel)"
        id="legende"
        nativeInputProps={{
          name: 'legende',
          defaultValue: légende,
        }}
        state={validationErrors.includes('legende') ? 'error' : 'default'}
        stateRelatedMessage="Légende à préciser"
        hintText="Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de 0 à 9"
      />

      <Input
        label="Expression régulière (optionnel)"
        id="expressionReguliere"
        nativeInputProps={{
          name: 'expressionReguliere',
          value: expressionReguliereValue,
        }}
        state={validationErrors.includes('expressionReguliere') ? 'error' : 'default'}
        stateRelatedMessage="Expression régulière à préciser"
        hintText="Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}"
      />

      <SubmitButton>Envoyer</SubmitButton>
    </Form>
  );
};
