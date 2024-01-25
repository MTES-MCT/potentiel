import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import {
  ProjetPageTemplate,
  ProjetPageTemplateProps,
} from '@/components/templates/ProjetPageTemplate';
import { Form } from '@/components/atoms/form/Form';
import { Heading2 } from '@/components/atoms/headings';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { TitrePageRaccordement } from '../TitreRaccordement';
import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from './GestionnaireRéseauSelect';
import { modifierGestionnaireRéseauRaccordementAction } from './modifierGestionnaireRéseauRaccordement.action';

type ModifierGestionnaireRéseauRaccordementPageProps = {
  projet: ProjetPageTemplateProps['projet'];
  identifiantGestionnaireRéseauActuel: string;
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['gestionnairesRéseau'];
};

export const ModifierGestionnaireRéseauRaccordementPage: FC<
  ModifierGestionnaireRéseauRaccordementPageProps
> = ({ projet, identifiantGestionnaireRéseauActuel, listeGestionnairesRéseau }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const { identifiantProjet } = projet;
  const gestionnaireActuel = listeGestionnairesRéseau.find(
    (gestionnaire) =>
      gestionnaire.identifiantGestionnaireRéseau === identifiantGestionnaireRéseauActuel,
  );

  return (
    <ProjetPageTemplate heading={<TitrePageRaccordement />} projet={projet}>
      <div className="flex flex-col md:flex-row gap-6">
        <Form
          className="flex flex-col md:w-4/5"
          action={modifierGestionnaireRéseauRaccordementAction}
          method="post"
          onSuccess={() => router.push(Routes.Raccordement.détail(projet.identifiantProjet))}
          onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
        >
          <Heading2>Modifier le gestionnaire de réseau du projet</Heading2>

          <div>
            <GestionnaireRéseauSelect
              id="identifiantGestionnaireRéseau"
              name="identifiantGestionnaireRéseau"
              state={
                validationErrors.includes('identifiantGestionnaireRéseau') ? 'error' : 'default'
              }
              stateRelatedMessage="Gestionnaire réseau à préciser"
              gestionnairesRéseau={listeGestionnairesRéseau}
              identifiantGestionnaireRéseauActuel={
                gestionnaireActuel?.identifiantGestionnaireRéseau
              }
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <SubmitButton>Modifier</SubmitButton>
            <a href={Routes.Raccordement.détail(identifiantProjet)} className="m-auto">
              Retour vers le dossier de raccordement
            </a>
          </div>
        </Form>

        <div className="flex">
          <Alert
            severity="info"
            title="Concernant la modification"
            description="La modification de cette information sera appliquée sur tous les dossiers de raccordements du projet."
          />
        </div>
      </div>
    </ProjetPageTemplate>
  );
};
