import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import {
  ModifierGestionnaireRéseauRaccordementForm,
  ModifierGestionnaireRéseauRaccordementFormProps,
} from './ModifierGestionnaireRéseauRaccordement.form';

export type ModifierGestionnaireRéseauRaccordementPageProps = {
  identifiantProjet: ModifierGestionnaireRéseauRaccordementFormProps['identifiantProjet'];
  identifiantGestionnaireRéseauActuel: ModifierGestionnaireRéseauRaccordementFormProps['identifiantGestionnaireRéseauActuel'];
  listeGestionnairesRéseau: ModifierGestionnaireRéseauRaccordementFormProps['listeGestionnairesRéseau'];
};

export const ModifierGestionnaireRéseauRaccordementPage: FC<
  ModifierGestionnaireRéseauRaccordementPageProps
> = ({ identifiantProjet, identifiantGestionnaireRéseauActuel, listeGestionnairesRéseau }) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <ModifierGestionnaireRéseauRaccordementForm
          identifiantProjet={identifiantProjet}
          identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
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
