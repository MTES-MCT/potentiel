import type { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import {
  InfoBoxDemandeComplèteRaccordement,
  type InfoBoxDemandeComplèteRaccordementProps,
} from '../[reference]/(demande-complète-raccordement)/InformationDemandeComplèteRaccordement';
import { AucunDossierDeRaccordementAlert } from '../components/AucunDossierDeRaccordementAlert';
import {
  TransmettreDemandeComplèteRaccordementForm,
  type TransmettreDemandeComplèteRaccordementFormProps,
} from './TransmettreDemandeComplèteRaccordement.form';

export type TransmettreDemandeComplèteRaccordementPageProps = {
  listeGestionnairesRéseau: TransmettreDemandeComplèteRaccordementFormProps['listeGestionnairesRéseau'];
  gestionnaireRéseauActuel: TransmettreDemandeComplèteRaccordementFormProps['gestionnaireRéseauActuel'];
  identifiantProjet: TransmettreDemandeComplèteRaccordementFormProps['identifiantProjet'];
  delaiDemandeDeRaccordementEnMois: InfoBoxDemandeComplèteRaccordementProps['delaiDemandeDeRaccordementEnMois'];
  aDéjàTransmisUneDemandeComplèteDeRaccordement: boolean;
};

export const TransmettreDemandeComplèteRaccordementPage: FC<
  TransmettreDemandeComplèteRaccordementPageProps
> = ({
  listeGestionnairesRéseau,
  gestionnaireRéseauActuel,
  identifiantProjet,
  delaiDemandeDeRaccordementEnMois,
  aDéjàTransmisUneDemandeComplèteDeRaccordement,
}) => (
  <ColumnPageTemplate
    heading={
      <>
        <TitrePageRaccordement />
        {!aDéjàTransmisUneDemandeComplèteDeRaccordement && (
          <AucunDossierDeRaccordementAlert identifiantProjet={identifiantProjet} showLink={false} />
        )}
      </>
    }
    leftColumn={{
      children: (
        <TransmettreDemandeComplèteRaccordementForm
          identifiantProjet={identifiantProjet}
          listeGestionnairesRéseau={listeGestionnairesRéseau}
          gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          aDéjàTransmisUneDemandeComplèteDeRaccordement={
            aDéjàTransmisUneDemandeComplèteDeRaccordement
          }
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
