import React, { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnTemplate } from '@/components/templates/Column.template';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../../InformationDemandeComplèteRaccordement';

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
  <ColumnTemplate
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
