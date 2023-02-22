import { User } from '@entities';
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain';
import { errAsync, wrapInfra } from '@core/utils';
import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon';
import { UnauthorizedError } from '@modules/shared';
import { StatutRéponseIncompatibleAvecAnnulationError } from '../../errors/StatutRéponseIncompatibleAvecAnnulationError';
import { AnnulationAbandonAnnulée } from '../events';

type Dépendances = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  demandeAnnulationAbandonRepo: TransactionalRepository<DemandeAnnulationAbandon>;
  publishToEventStore: EventStore['publish'];
};

type Commande = {
  user: User;
  demandeId: string;
};

export const makeAnnulerDemandeAnnulationAbandon =
  ({ demandeAnnulationAbandonRepo, shouldUserAccessProject, publishToEventStore }: Dépendances) =>
  ({ demandeId, user }: Commande) =>
    demandeAnnulationAbandonRepo.transaction(
      new UniqueEntityID(demandeId),
      (demandeAnnulationAbandon) => {
        const { statut, projetId } = demandeAnnulationAbandon;

        return wrapInfra(shouldUserAccessProject({ projectId: projetId, user })).andThen(
          (userHasRightsToProject) => {
            if (!userHasRightsToProject) {
              return errAsync(new UnauthorizedError());
            }

            if (statut !== 'envoyée') {
              return errAsync(new StatutRéponseIncompatibleAvecAnnulationError(statut));
            }

            return publishToEventStore(
              new AnnulationAbandonAnnulée({
                payload: { demandeId, annuléePar: user.id },
              }),
            );
          },
        );
      },
    );
