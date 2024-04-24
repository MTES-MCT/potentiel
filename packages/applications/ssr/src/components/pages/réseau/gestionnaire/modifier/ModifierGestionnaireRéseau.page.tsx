'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { modifierGestionnaireRéseauAction } from './modifierGestionnaireRéseau.action';

export type ModifierGestionnaireRéseauProps = {
  identifiantGestionnaireRéseau: string;
  raisonSociale: string;
  expressionReguliere: string;
  format: string;
  légende: string;
};

export const ModifierGestionnaireRéseauPage: FC<ModifierGestionnaireRéseauProps> = ({
  identifiantGestionnaireRéseau,
  raisonSociale,
  format,
  légende,
  expressionReguliere,
}: ModifierGestionnaireRéseauProps) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
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
        buttons={<SubmitButton>Envoyer</SubmitButton>}
      >
        <div className="mb-6">
          <label>Code EIC ou Gestionnaire: {identifiantGestionnaireRéseau}</label>
        </div>

        <input
          type={'hidden'}
          value={identifiantGestionnaireRéseau}
          name="identifiantGestionnaireReseau"
        />

        <Input
          textArea
          label="Raison sociale"
          id="raisonSociale"
          nativeTextAreaProps={{
            name: 'raisonSociale',
            defaultValue: raisonSociale,
          }}
          state={validationErrors.includes('raisonSociale') ? 'error' : 'default'}
          stateRelatedMessage="Raison sociale à préciser"
        />

        <Input
          textArea
          label="Format de l'identifiant du dossier de raccordement (optionnel)"
          id="format"
          nativeTextAreaProps={{
            name: 'format',
            defaultValue: format,
          }}
          state={validationErrors.includes('format') ? 'error' : 'default'}
          stateRelatedMessage="Format à préciser"
          hintText="Exemple : XXX-RP-AAAA-999999"
        />

        <Input
          textArea
          label="Aide à la saisie de l'identifiant du dossier de raccordement (optionnel)"
          id="legende"
          nativeTextAreaProps={{
            name: 'legende',
            defaultValue: légende,
          }}
          state={validationErrors.includes('legende') ? 'error' : 'default'}
          stateRelatedMessage="Légende à préciser"
          hintText="Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de 0 à 9"
        />

        <Input
          textArea
          label="Expression régulière (optionnel)"
          id="expressionReguliere"
          nativeTextAreaProps={{
            name: 'expressionReguliere',
            value: expressionReguliere,
          }}
          state={validationErrors.includes('expressionReguliere') ? 'error' : 'default'}
          stateRelatedMessage="Expression régulière à préciser"
          hintText="Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}"
        />
      </Form>
    </PageTemplate>
  );
};
