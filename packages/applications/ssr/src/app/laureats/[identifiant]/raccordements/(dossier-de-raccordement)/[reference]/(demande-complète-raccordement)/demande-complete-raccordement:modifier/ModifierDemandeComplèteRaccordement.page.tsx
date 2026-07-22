import type { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';
import {
  InfoBoxDemandeComplèteRaccordement,
  type InfoBoxDemandeComplèteRaccordementProps,
} from '../InformationDemandeComplèteRaccordement';
import {
  ModifierDemandeComplèteRaccordementForm,
  type ModifierDemandeComplèteRaccordementFormProps,
} from './ModifierDemandeComplèteRaccordement.form';

export type ModifierDemandeComplèteRaccordementPageProps =
  ModifierDemandeComplèteRaccordementFormProps & {
    delaiDemandeDeRaccordementEnMois: InfoBoxDemandeComplèteRaccordementProps['delaiDemandeDeRaccordementEnMois'];
  };

export const ModifierDemandeComplèteRaccordementPage: FC<
  ModifierDemandeComplèteRaccordementPageProps
> = ({
  identifiantProjet,
  raccordement,
  gestionnaireRéseauActuel,
  delaiDemandeDeRaccordementEnMois,
  listeGestionnairesRéseau,
}) => (
  <ColumnPageTemplate
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <ModifierDemandeComplèteRaccordementForm
          identifiantProjet={identifiantProjet}
          gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          raccordement={raccordement}
          listeGestionnairesRéseau={listeGestionnairesRéseau}
        />
      ),
    }}
    rightColumn={{
      children: (
        <InfoBoxDemandeComplèteRaccordement
          delaiDemandeDeRaccordementEnMois={delaiDemandeDeRaccordementEnMois}
        />
      ),
    }}
  />
);
