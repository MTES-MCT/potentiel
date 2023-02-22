import { EventStore, TransactionalRepository } from '@core/domain';
import { User } from '@entities';
import { UnauthorizedError } from '@modules/shared';
import { userIsNot } from '@modules/users';
import { errAsync } from '@core/utils';
import { ImportDonnéesRaccordement } from '../ImportDonnéesRaccordement';
import ImportDonnéesRaccordementId from '../ImportDonnéesRaccordementId';
import { TâcheMiseAJourDonnéesDeRaccordementDémarrée } from '../events';
import { DonnéesDeMiseAJourObligatoiresError } from './DonnéesDeMiseAJourObligatoiresError';
import { DonnéesRaccordement } from '../DonnéesRaccordement';
import { DémarrageImpossibleError } from './DémarrageImpossibleError';

type MakeDémarrerImportDonnéesRaccordementDépendances = {
  importRepo: TransactionalRepository<ImportDonnéesRaccordement>;
  publishToEventStore: EventStore['publish'];
};

export type DémarrerImportDonnéesRaccordementCommande = {
  utilisateur: User;
  gestionnaire: 'Enedis';
  données: DonnéesRaccordement[];
};

export const makeDémarrerImportDonnéesRaccordement =
  ({ importRepo, publishToEventStore }: MakeDémarrerImportDonnéesRaccordementDépendances) =>
  (commande: DémarrerImportDonnéesRaccordementCommande) => {
    const { utilisateur, gestionnaire, données } = commande;

    if (userIsNot(['admin', 'dgec-validateur'])(utilisateur)) {
      return errAsync(new UnauthorizedError());
    }

    return importRepo.transaction(
      ImportDonnéesRaccordementId.format(gestionnaire),
      (importDonnéesRaccordement) => {
        if (importDonnéesRaccordement.état === 'en cours') {
          return errAsync(new DémarrageImpossibleError(commande));
        }

        if (données.length === 0) {
          return errAsync(new DonnéesDeMiseAJourObligatoiresError(commande));
        }

        return publishToEventStore(
          new TâcheMiseAJourDonnéesDeRaccordementDémarrée({
            payload: {
              misAJourPar: utilisateur.id,
              gestionnaire,
              données,
            },
          }),
        );
      },
      {
        acceptNew: true,
      },
    );
  };
