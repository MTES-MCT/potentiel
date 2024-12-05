import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { AlerteRaccordement } from '../../../../views/pages';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getAlertesRaccordement = async ({
  userRole,
  identifiantProjet,
  CDC2022Choisi,
  projet,
}: {
  userRole: UtilisateurReadModel['role'];
  identifiantProjet: IdentifiantProjet.ValueType;
  CDC2022Choisi: boolean;
  projet: {
    isClasse: boolean;
    isAbandonned: boolean;
  };
}) => {
  try {
    if (userRole !== 'porteur-projet' || !projet.isClasse || projet.isAbandonned) {
      return undefined;
    }

    const alertes: Array<AlerteRaccordement> = [];
    const dossiersRaccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (Option.isSome(dossiersRaccordement) && !!dossiersRaccordement.dossiers[0]) {
      if (
        CDC2022Choisi &&
        dossiersRaccordement.dossiers[0].référence.estÉgaleÀ(
          Raccordement.RéférenceDossierRaccordement.référenceNonTransmise,
        )
      ) {
        alertes.push('référenceDossierManquantePourDélaiCDC2022');
      }

      if (!dossiersRaccordement.dossiers[0].demandeComplèteRaccordement.accuséRéception) {
        alertes.push('demandeComplèteRaccordementManquante');
      }
    } else {
      alertes.push('demandeComplèteRaccordementManquante');
      if (CDC2022Choisi) {
        alertes.push('référenceDossierManquantePourDélaiCDC2022');
      }
    }

    return alertes.length > 0 ? alertes : undefined;
  } catch (error) {
    getLogger().error(`Impossible de consulter le raccordement`, {
      identifiantProjet: identifiantProjet.formatter(),
      context: 'legacy',
      controller: 'getProjectPage',
      method: 'getAlertesRaccordement',
    });
    return undefined;
  }
};
