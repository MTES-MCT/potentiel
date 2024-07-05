'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from './GestionnaireRéseauSelect';
import { modifierGestionnaireRéseauRaccordementAction } from './modifierGestionnaireRéseauRaccordement.action';

export type ModifierGestionnaireRéseauRaccordementPageProps = {
  identifiantProjet: string;
  identifiantGestionnaireRéseauActuel: string;
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['gestionnairesRéseau'];
};

export const ModifierGestionnaireRéseauRaccordementPage: FC<
  ModifierGestionnaireRéseauRaccordementPageProps
> = ({ identifiantProjet, identifiantGestionnaireRéseauActuel, listeGestionnairesRéseau }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const gestionnaireActuel = listeGestionnairesRéseau.find(
    (gestionnaire) =>
      gestionnaire.identifiantGestionnaireRéseau === identifiantGestionnaireRéseauActuel,
  );

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            action={modifierGestionnaireRéseauRaccordementAction}
            method="post"
            onSuccess={() => router.push(Routes.Raccordement.détail(identifiantProjet))}
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
            heading="Modifier le gestionnaire de réseau du projet"
          >
            <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

            <div className="flex flex-col gap-5">
              <div>
                <GestionnaireRéseauSelect
                  id="identifiantGestionnaireReseau"
                  name="identifiantGestionnaireReseau"
                  state={
                    validationErrors.includes('identifiantGestionnaireReseau') ? 'error' : 'default'
                  }
                  stateRelatedMessage="Gestionnaire réseau à préciser"
                  gestionnairesRéseau={listeGestionnairesRéseau}
                  identifiantGestionnaireRéseauActuel={
                    gestionnaireActuel?.identifiantGestionnaireRéseau
                  }
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 m-auto">
                <Button
                  priority="secondary"
                  linkProps={{
                    href: Routes.Raccordement.détail(identifiantProjet),
                  }}
                  iconId="fr-icon-arrow-left-line"
                >
                  Retour aux dossiers de raccordement
                </Button>
                <SubmitButton>Modifier</SubmitButton>
              </div>
            </div>
          </Form>
        ),
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            title="Concernant la modification"
            description={
              <div className="py-4 text-justify">
                La modification de cette information sera appliquée sur tous les dossiers de
                raccordements du projet.
              </div>
            }
          />
        ),
      }}
    />
  );
};
