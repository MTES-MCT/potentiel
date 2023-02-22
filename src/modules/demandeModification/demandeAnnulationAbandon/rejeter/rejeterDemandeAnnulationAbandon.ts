import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain';
import { errAsync } from '@core/utils';
import { User } from '@entities';
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { userIsNot } from '@modules/users';

import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon';
import { AnnulationAbandonRejetée } from '../events';
import { StatutIncompatiblePourRejeterDemandeAnnulationAbandonError } from './StatutIncompatiblePourRejeterDemandeAnnulationAbandonError';

type Dépendances = {
  demandeAnnulationAbandonRepo: TransactionalRepository<DemandeAnnulationAbandon>;
  publishToEventStore: EventStore['publish'];
  fileRepo: Repository<FileObject>;
};

type Commande = {
  user: User;
  demandeId: string;
  fichierRéponse: { contents: FileContents; filename: string };
};

export const makeRejeterDemandeAnnulationAbandon =
  ({ publishToEventStore, demandeAnnulationAbandonRepo, fileRepo }: Dépendances) =>
  ({ user, demandeId, fichierRéponse: { filename, contents } }: Commande) => {
    if (userIsNot(['admin', 'dgec-validateur'])(user)) {
      return errAsync(new UnauthorizedError());
    }

    return demandeAnnulationAbandonRepo.transaction(new UniqueEntityID(demandeId), (demande) => {
      const { statut, projetId } = demande;

      if (statut !== 'envoyée') {
        return errAsync(new StatutIncompatiblePourRejeterDemandeAnnulationAbandonError(statut));
      }

      if (!projetId) {
        return errAsync(new InfraNotAvailableError());
      }

      return makeAndSaveFile({
        file: {
          designation: 'modification-request-response',
          forProject: new UniqueEntityID(projetId),
          createdBy: new UniqueEntityID(user.id),
          filename,
          contents,
        },
        fileRepo,
      }).andThen((fichierRéponseId) => {
        return publishToEventStore(
          new AnnulationAbandonRejetée({
            payload: {
              demandeId,
              rejetéPar: user.id,
              fichierRéponseId,
              projetId,
            },
          }),
        );
      });
    });
  };
