import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../../InformationDemandeComplèteRaccordement';
import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { GestionnaireRéseauSelectProps } from '../../modifier/modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';

import { TransmettreDemandeComplèteRaccordementForm } from './TransmettreDemandeComplèteRaccordement.form';

export type TransmettreDemandeComplèteRaccordementPageProps = {
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['gestionnairesRéseau'];
  identifiantGestionnaireRéseauActuel?: string;
  identifiantProjet: string;
  delaiDemandeDeRaccordementEnMois: InformationDemandeComplèteRaccordementProps['delaiDemandeDeRaccordementEnMois'];
};

export const TransmettreDemandeComplèteRaccordementPage: FC<
  TransmettreDemandeComplèteRaccordementPageProps
> = ({
  listeGestionnairesRéseau,
  identifiantGestionnaireRéseauActuel,
  identifiantProjet,
  delaiDemandeDeRaccordementEnMois,
}) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <TransmettreDemandeComplèteRaccordementForm
          identifiantProjet={identifiantProjet}
          listeGestionnairesRéseau={listeGestionnairesRéseau}
          identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
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
