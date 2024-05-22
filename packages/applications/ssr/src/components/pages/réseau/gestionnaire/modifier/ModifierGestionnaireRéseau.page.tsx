'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import {
  ConsulterGestionnaireRéseauReadModel,
  IdentifiantGestionnaireRéseau,
} from '@potentiel-domain/reseau/src/gestionnaire';
import { PlainType } from '@potentiel-domain/core';
import { ExpressionRegulière, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { modifierGestionnaireRéseauAction } from './modifierGestionnaireRéseau.action';

export type ModifierGestionnaireRéseauProps = PlainType<ConsulterGestionnaireRéseauReadModel>;

export const ModifierGestionnaireRéseauPage: FC<ModifierGestionnaireRéseauProps> = ({
  identifiantGestionnaireRéseau,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  contactEmail,
}: ModifierGestionnaireRéseauProps) => {
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

  const identifiantGestionnaireReseauValue = IdentifiantGestionnaireRéseau.bind(
    identifiantGestionnaireRéseau,
  ).formatter();
  return (
    <PageTemplate
      banner={
        <Heading1 className="text-theme-white">
          Modifier le gestionnaire de réseau ({raisonSociale})
        </Heading1>
      }
    >
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
    </PageTemplate>
  );
};
