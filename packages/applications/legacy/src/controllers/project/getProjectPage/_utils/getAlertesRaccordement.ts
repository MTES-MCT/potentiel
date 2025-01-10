import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { AlerteRaccordement } from '../../../../views/pages';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Role } from '@potentiel-domain/utilisateur';

export const getAlertesRaccordement = async ({
  role,
  identifiantProjet,
  CDC2022Choisi,
  raccordement,
  statutAbandon,
}: {
  role: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  CDC2022Choisi: boolean;
  raccordement: Option.Type<Raccordement.ConsulterRaccordementReadModel>;
  statutAbandon?: string;
}) => {
  try {
    if (!role.estÉgaleÀ(Role.porteur) || statutAbandon === 'accordé') {
      return [];
    }

    const alertes: Array<AlerteRaccordement> = [];
    if (Option.isNone(raccordement) || raccordement.dossiers.length === 0) {
      alertes.push('demandeComplèteRaccordementManquante');
      if (CDC2022Choisi) {
        alertes.push('référenceDossierManquantePourDélaiCDC2022');
      }
      return alertes;
    }

    const dossier = raccordement.dossiers[0];

    if (!dossier.demandeComplèteRaccordement.accuséRéception) {
      alertes.push('demandeComplèteRaccordementManquante');
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
