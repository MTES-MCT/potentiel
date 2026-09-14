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
  ajouterLienVersLaModificationDuGestionnaire: boolean;
};

export const TransmettreDemandeComplèteRaccordementPage: FC<
  TransmettreDemandeComplèteRaccordementPageProps
> = ({
  listeGestionnairesRéseau,
  gestionnaireRéseauActuel,
  identifiantProjet,
  aDéjàTransmisUneDemandeComplèteDeRaccordement,
  ajouterLienVersLaModificationDuGestionnaire,
}) => (
  <SectionPage title="Transmettre une demande complète de raccordement">
    {!aDéjàTransmisUneDemandeComplèteDeRaccordement && (
      <AucunDossierDeRaccordementAlert identifiantProjet={identifiantProjet} showLink={false} />
    )}
    <TransmettreDemandeComplèteRaccordementForm
      identifiantProjet={identifiantProjet}
      listeGestionnairesRéseau={listeGestionnairesRéseau}
      gestionnaireRéseauActuel={gestionnaireRéseauActuel}
      ajouterLienVersLaModificationDuGestionnaire={ajouterLienVersLaModificationDuGestionnaire}
    />
  </SectionPage>
);
