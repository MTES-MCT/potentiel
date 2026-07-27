import type { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { AucunDossierDeRaccordementAlert } from '../components/AucunDossierDeRaccordementAlert';
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
  <PageTemplate>
    <div className="flex flex-col gap-4">
      {!aDéjàTransmisUneDemandeComplèteDeRaccordement && (
        <AucunDossierDeRaccordementAlert identifiantProjet={identifiantProjet} showLink={false} />
      )}
      <TransmettreDemandeComplèteRaccordementForm
        identifiantProjet={identifiantProjet}
        listeGestionnairesRéseau={listeGestionnairesRéseau}
        gestionnaireRéseauActuel={gestionnaireRéseauActuel}
        aDéjàTransmisUneDemandeComplèteDeRaccordement={
          aDéjàTransmisUneDemandeComplèteDeRaccordement
        }
      />
    </div>
  </PageTemplate>
);
