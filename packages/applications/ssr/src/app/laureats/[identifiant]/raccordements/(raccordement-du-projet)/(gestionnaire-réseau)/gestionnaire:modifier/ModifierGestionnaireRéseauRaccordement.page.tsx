import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../../TitrePageRaccordement';

import {
  ModifierGestionnaireRéseauRaccordementForm,
  ModifierGestionnaireRéseauRaccordementFormProps,
} from './ModifierGestionnaireRéseauRaccordement.form';

export type ModifierGestionnaireRéseauRaccordementPageProps = {
  identifiantProjet: ModifierGestionnaireRéseauRaccordementFormProps['identifiantProjet'];
  gestionnaireRéseauActuel: ModifierGestionnaireRéseauRaccordementFormProps['gestionnaireRéseauActuel'];
  listeGestionnairesRéseau: ModifierGestionnaireRéseauRaccordementFormProps['listeGestionnairesRéseau'];
};

export const ModifierGestionnaireRéseauRaccordementPage: FC<
  ModifierGestionnaireRéseauRaccordementPageProps
> = ({ identifiantProjet, gestionnaireRéseauActuel, listeGestionnairesRéseau }) => (
  <ColumnPageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <ModifierGestionnaireRéseauRaccordementForm
          identifiantProjet={identifiantProjet}
          gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          listeGestionnairesRéseau={listeGestionnairesRéseau}
        />
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
