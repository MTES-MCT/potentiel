import { User } from '../../../../entities';
import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../../core/domain';
import { errAsync, wrapInfra } from '../../../../core/utils';
import { InfraNotAvailableError, UnauthorizedError } from '../../../shared';
import { StatusPreventsCancellingError } from '../../../modificationRequest';
import { AbandonAnnulé } from '../events';
import { DemandeAbandon } from '../DemandeAbandon';

type MakeAnnulerDemandeAbandonProps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  demandeAbandonRepo: TransactionalRepository<DemandeAbandon>;
  publishToEventStore: EventStore['publish'];
};

type AnnulerDemandeAbandonProps = {
  user: User;
  demandeAbandonId: string;
};

export const makeAnnulerDemandeAbandon =
  ({
    shouldUserAccessProject,
    demandeAbandonRepo,
    publishToEventStore,
  }: MakeAnnulerDemandeAbandonProps) =>
  ({ user, demandeAbandonId }: AnnulerDemandeAbandonProps) =>
    demandeAbandonRepo.transaction(new UniqueEntityID(demandeAbandonId), (demandeAbandon) => {
      const { statut, projetId } = demandeAbandon;
      if (!projetId) {
        return errAsync(new InfraNotAvailableError());
      }

      return wrapInfra(shouldUserAccessProject({ projectId: projetId, user })).andThen(
        (userHasRightsToProject) => {
          if (!userHasRightsToProject) {
            return errAsync(new UnauthorizedError());
          }
          if (!['envoyée', 'en instruction', 'en attente de confirmation'].includes(statut)) {
            return errAsync(new StatusPreventsCancellingError(statut || 'inconnu'));
          }
          return publishToEventStore(
            new AbandonAnnulé({
              payload: { demandeAbandonId, projetId, annuléPar: user.id },
            }),
          );
        },
      );
    });
