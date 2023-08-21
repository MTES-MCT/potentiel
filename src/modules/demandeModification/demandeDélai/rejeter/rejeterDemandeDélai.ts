import {
  EventStore,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '../../../../core/domain';
import { errAsync, ResultAsync, wrapInfra } from '../../../../core/utils';
import { User } from '../../../../entities';
import { FileContents, FileObject, makeAndSaveFile } from '../../../file';
import { InfraNotAvailableError, UnauthorizedError } from '../../../shared';
import { userIsNot } from '../../../users';
import { DemandeDélai } from '../DemandeDélai';
import { DélaiRejeté } from '../events/DélaiRejeté';
import { RejeterDemandeDélaiError } from './RejeterDemandeDélaiError';

type RejeterDemandeDélai = (commande: {
  user: User;
  demandeDélaiId: string;
  fichierRéponse: { contents: FileContents; filename: string };
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>;

type MakeRejeterDemandeDélai = (dépendances: {
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>;
  publishToEventStore: EventStore['publish'];
  fileRepo: Repository<FileObject>;
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
}) => RejeterDemandeDélai;

export const makeRejeterDemandeDélai: MakeRejeterDemandeDélai =
  ({ publishToEventStore, demandeDélaiRepo, fileRepo, shouldUserAccessProject }) =>
  ({ user, demandeDélaiId, fichierRéponse: { filename, contents } }) => {
    if (userIsNot(['admin', 'dgec-validateur', 'dreal'])(user)) {
      return errAsync(new UnauthorizedError());
    }

    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
      const { statut, projetId } = demandeDélai;
      if (!projetId) return errAsync(new InfraNotAvailableError());

      return wrapInfra(shouldUserAccessProject({ projectId: projetId, user })).andThen(
        (userHasRightsToProject) => {
          if (!userHasRightsToProject) return errAsync(new UnauthorizedError());

          if (statut !== 'envoyée' && statut !== 'en instruction') {
            return errAsync(
              new RejeterDemandeDélaiError(
                demandeDélai,
                'Seul une demande envoyée ou en instruction peut être rejetée.',
              ),
            );
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
          }).andThen((fichierRéponseId) =>
            publishToEventStore(
              new DélaiRejeté({
                payload: {
                  demandeDélaiId,
                  rejetéPar: user.id,
                  fichierRéponseId,
                  projetId,
                },
              }),
            ),
          );
        },
      );
    });
  };
