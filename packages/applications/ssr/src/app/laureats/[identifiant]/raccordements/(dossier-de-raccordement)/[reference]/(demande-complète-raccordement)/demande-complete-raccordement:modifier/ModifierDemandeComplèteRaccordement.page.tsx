import Alert from '@codegouvfr/react-dsfr/Alert';
import type { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';
import {
  InformationDemandeComplèteRaccordement,
  type InformationDemandeComplèteRaccordementProps,
} from '../InformationDemandeComplèteRaccordement';
import {
  ModifierDemandeComplèteRaccordementForm,
  type ModifierDemandeComplèteRaccordementFormProps,
} from './ModifierDemandeComplèteRaccordement.form';

export type ModifierDemandeComplèteRaccordementPageProps =
  ModifierDemandeComplèteRaccordementFormProps & {
    delaiDemandeDeRaccordementEnMois: InformationDemandeComplèteRaccordementProps['delaiDemandeDeRaccordementEnMois'];
  };

export const ModifierDemandeComplèteRaccordementPage: FC<
  ModifierDemandeComplèteRaccordementPageProps
> = ({
  identifiantProjet,
  raccordement,
  gestionnaireRéseauActuel,
  delaiDemandeDeRaccordementEnMois,
}) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <ModifierDemandeComplèteRaccordementForm
          identifiantProjet={identifiantProjet}
          gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          raccordement={raccordement}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <div className="py-4 text-justify">
              <InformationDemandeComplèteRaccordement
                delaiDemandeDeRaccordementEnMois={delaiDemandeDeRaccordementEnMois}
              />
            </div>
          }
        />
      ),
    }}
  />
);
