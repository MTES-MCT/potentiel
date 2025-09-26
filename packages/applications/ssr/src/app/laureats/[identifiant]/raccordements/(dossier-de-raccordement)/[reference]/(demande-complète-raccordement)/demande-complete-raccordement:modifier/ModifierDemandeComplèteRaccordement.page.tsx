import React, { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';
import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../InformationDemandeComplèteRaccordement';

import {
  ModifierDemandeComplèteRaccordementForm,
  ModifierDemandeComplèteRaccordementFormProps,
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
    banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}
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
