import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { AlerteRaccordement } from '../../../../views/pages';
import { getLogger } from '@potentiel-libraries/monitoring';
import { GetRaccordementForProjectPage } from './getRaccordement';

export const getAlertesRaccordement = async ({
  identifiantProjet,
  CDC2022Choisi,
  raccordement,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  CDC2022Choisi: boolean;
  raccordement: GetRaccordementForProjectPage['raccordement'];
}) => {
  try {
    const alertes: Array<AlerteRaccordement> = [];

    if (Option.isNone(raccordement) || raccordement.dossiers.length === 0) {
      alertes.push('demandeComplèteRaccordementManquante');
      if (CDC2022Choisi) {
        alertes.push('référenceDossierManquantePourDélaiCDC2022');
      }
    } else {
      if (!raccordement.dossiers[0].demandeComplèteRaccordement.accuséRéception) {
        alertes.push('demandeComplèteRaccordementManquante');
      }
    }

    return alertes;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getAlertesRaccordement').error(
      `Impossible de consulter le raccordement`,
      {
        identifiantProjet: identifiantProjet.formatter(),
      },
    );
    return [];
  }
};
