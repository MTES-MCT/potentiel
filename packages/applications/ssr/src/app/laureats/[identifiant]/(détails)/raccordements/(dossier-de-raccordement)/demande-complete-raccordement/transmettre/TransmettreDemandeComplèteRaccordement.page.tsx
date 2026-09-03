import type { FC } from 'react';

import { SectionPage } from '@/components/atoms/section/SectionPage';
import { AucunDossierDeRaccordementAlert } from '../../components/AucunDossierDeRaccordementAlert';
import {
  TransmettreDemandeComplèteRaccordementForm,
  type TransmettreDemandeComplèteRaccordementFormProps,
} from './TransmettreDemandeComplèteRaccordement.form';

export type TransmettreDemandeComplèteRaccordementPageProps = {
  listeGestionnairesRéseau: TransmettreDemandeComplèteRaccordementFormProps['listeGestionnairesRéseau'];
  gestionnaireRéseauActuel: TransmettreDemandeComplèteRaccordementFormProps['gestionnaireRéseauActuel'];
  identifiantProjet: TransmettreDemandeComplèteRaccordementFormProps['identifiantProjet'];
  aDéjàTransmisUneDemandeComplèteDeRaccordement: boolean;
};

export const TransmettreDemandeComplèteRaccordementPage: FC<
  TransmettreDemandeComplèteRaccordementPageProps
> = ({
  listeGestionnairesRéseau,
  gestionnaireRéseauActuel,
  identifiantProjet,
  aDéjàTransmisUneDemandeComplèteDeRaccordement,
}) => (
  <SectionPage title="Transmettre une demande complète de raccordement">
    {!aDéjàTransmisUneDemandeComplèteDeRaccordement && (
      <AucunDossierDeRaccordementAlert identifiantProjet={identifiantProjet} showLink={false} />
    )}
    <TransmettreDemandeComplèteRaccordementForm
      identifiantProjet={identifiantProjet}
      listeGestionnairesRéseau={listeGestionnairesRéseau}
      gestionnaireRéseauActuel={gestionnaireRéseauActuel}
      aDéjàTransmisUneDemandeComplèteDeRaccordement={aDéjàTransmisUneDemandeComplèteDeRaccordement}
    />
  </SectionPage>
);
