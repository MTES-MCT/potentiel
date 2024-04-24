'use client';

import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from './GestionnaireRéseauSelect';
import { modifierGestionnaireRéseauRaccordementAction } from './modifierGestionnaireRéseauRaccordement.action';

export type ModifierGestionnaireRéseauRaccordementPageProps = {
  projet: ProjetBannerProps;
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
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            action={modifierGestionnaireRéseauRaccordementAction}
            method="post"
            onSuccess={() => router.push(Routes.Raccordement.détail(projet.identifiantProjet))}
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
            heading="Modifier le gestionnaire de réseau du projet"
            buttons={
              <>
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
              </>
            }
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
