import { User } from '../../../../entities';
import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../../core/domain';
import { DemandeDélai } from '../DemandeDélai';
import { errAsync, ResultAsync, wrapInfra } from '../../../../core/utils';
import {
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from "../../../shared";
import { StatusPreventsCancellingError } from "../../../modificationRequest";
import { DélaiAnnulé } from "../..";

type AnnulerDemandeDélai = (commande: {
  user: User;
  demandeDélaiId: string;
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError>;

type MakeAnnulerDemandeDélai = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>;
  publishToEventStore: EventStore['publish'];
}) => AnnulerDemandeDélai;

export const makeAnnulerDemandeDélai: MakeAnnulerDemandeDélai =
  ({ shouldUserAccessProject, demandeDélaiRepo, publishToEventStore }) =>
  ({ user, demandeDélaiId }) => {
    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
      const { statut, projetId } = demandeDélai;
      if (!projetId) {
        return errAsync(new InfraNotAvailableError());
      }

      return wrapInfra(shouldUserAccessProject({ projectId: projetId, user })).andThen(
        (userHasRightsToProject) => {
          if (!userHasRightsToProject) {
            return errAsync(new UnauthorizedError());
          }
          if (statut === 'envoyée' || statut === 'en instruction') {
            return publishToEventStore(
              new DélaiAnnulé({
                payload: { demandeDélaiId, projetId, annuléPar: user.id },
              }),
            );
          }
          return errAsync(new StatusPreventsCancellingError(statut || 'inconnu'));
        },
      );
    });
  };
