'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { ajouterGestionnaireRéseauAction } from './ajouterGestionnaireRéseau.action';

export const AjouterGestionnaireRéseauPage: FC = () => {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  return (
    <PageTemplate
      banner={<Heading1 className="text-white">Ajouter un gestionnaire de réseau</Heading1>}
    >
      <Form
        action={ajouterGestionnaireRéseauAction}
        method="post"
        encType="multipart/form-data"
        onSuccess={() => router.push(Routes.Gestionnaire.lister)}
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      >
        <Input
          textArea
          label="Code EIC ou gestionnaire"
          id="identifiantGestionnaireReseau"
          nativeTextAreaProps={{ name: 'identifiantGestionnaireReseau' }}
          state={validationErrors.includes('identifiantGestionnaireReseau') ? 'error' : 'default'}
          stateRelatedMessage="Code EIC ou gestionnaire à préciser"
        />

        <Input
          textArea
          label="Raison sociale"
          id="raisonSociale"
          nativeTextAreaProps={{ name: 'raisonSociale' }}
          state={validationErrors.includes('raisonSociale') ? 'error' : 'default'}
          stateRelatedMessage="Raison sociale à préciser"
        />

        <Input
          textArea
          label="Format de l'identifiant du dossier de raccordement (optionnel)"
          id="format"
          nativeTextAreaProps={{ name: 'format' }}
          state={validationErrors.includes('format') ? 'error' : 'default'}
          stateRelatedMessage="Format à préciser"
          hintText="Exemple : XXX-RP-AAAA-999999"
        />

        <Input
          textArea
          label="Aide à la saisie de l'identifiant du dossier de raccordement (optionnel)"
          id="legende"
          nativeTextAreaProps={{ name: 'legende' }}
          state={validationErrors.includes('legende') ? 'error' : 'default'}
          stateRelatedMessage="Légende à préciser"
          hintText="Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de 0 à 9"
        />

        <Input
          textArea
          label="Expression régulière (optionnel)"
          id="expressionReguliere"
          nativeTextAreaProps={{ name: 'expressionReguliere' }}
          state={validationErrors.includes('expressionReguliere') ? 'error' : 'default'}
          stateRelatedMessage="expression régulière à préciser"
          hintText="Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}"
        />

        <SubmitButton>Envoyer</SubmitButton>
      </Form>
    </PageTemplate>
  );
};
