import React, { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../../InformationDemandeComplèteRaccordement';

import { ModifierDemandeComplèteRaccordementForm } from './ModifierDemandeComplèteRaccordement.form';

export type ModifierDemandeComplèteRaccordementPageProps = {
  identifiantProjet: string;
  raccordement: {
    référence: string;
    demandeComplèteRaccordement: {
      dateQualification?: Iso8601DateTime;
      accuséRéception?: string;
    };
    canEditRéférence: boolean;
  };
  gestionnaireRéseauActuel: {
    identifiantGestionnaireRéseau: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement?: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  };
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
          canEditRéférence={false}
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
