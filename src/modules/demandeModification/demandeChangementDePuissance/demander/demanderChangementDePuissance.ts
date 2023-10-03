import {
  EventBus,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '../../../../core/domain';
import { errAsync, logger, okAsync, ok, ResultAsync, wrapInfra } from '../../../../core/utils';
import { User, formatCahierDesChargesRéférence } from '../../../../entities';
import { FileContents, FileObject, makeAndSaveFile } from '../../../file';
import { Project } from '../../../project';
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../../shared';
import { ModificationRequested, ModificationReceived } from '../../../modificationRequest/events';

import { ExceedsPuissanceMaxDuVolumeReserve, ExceedsRatiosChangementPuissance } from './helpers';
import { PuissanceJustificationEtCourrierManquantError } from '.';
import { GetProjectAppelOffre } from '../../../projectAppelOffre';

type DemanderChangementDePuissance = (commande: {
  projectId: string;
  requestedBy: User;
  newPuissance: number;
  justification?: string;
  fichier?: { contents: FileContents; filename: string };
}) => ResultAsync<
  null,
  | PuissanceJustificationEtCourrierManquantError
  | AggregateHasBeenUpdatedSinceError
  | EntityNotFoundError
  | UnauthorizedError
>;

type MakeDemanderChangementDePuissance = (dépendances: {
  eventBus: EventBus;
  exceedsRatiosChangementPuissance: ExceedsRatiosChangementPuissance;
  exceedsPuissanceMaxDuVolumeReserve: ExceedsPuissanceMaxDuVolumeReserve;
  getPuissanceProjet: (
    projectId: string,
  ) => ResultAsync<number, EntityNotFoundError | InfraNotAvailableError>;
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  projectRepo: TransactionalRepository<Project>;
  fileRepo: Repository<FileObject>;
  getProjectAppelOffre: GetProjectAppelOffre;
}) => DemanderChangementDePuissance;

export const makeDemanderChangementDePuissance: MakeDemanderChangementDePuissance =
  ({
    eventBus,
    exceedsRatiosChangementPuissance,
    exceedsPuissanceMaxDuVolumeReserve,
    getPuissanceProjet,
    shouldUserAccessProject,
    projectRepo,
    fileRepo,
    getProjectAppelOffre,
  }) =>
  ({ projectId, requestedBy, newPuissance, justification, fichier }) => {
    return wrapInfra(shouldUserAccessProject({ projectId, user: requestedBy }))
      .andThen(
        (
          userHasRightsToProject,
        ): ResultAsync<
          any,
          AggregateHasBeenUpdatedSinceError | InfraNotAvailableError | UnauthorizedError
        > => {
          if (!userHasRightsToProject) return errAsync(new UnauthorizedError());
          if (!fichier) return okAsync(null);

          return makeAndSaveFile({
            file: {
              designation: 'modification-request',
              forProject: new UniqueEntityID(projectId),
              createdBy: new UniqueEntityID(requestedBy.id),
              filename: fichier.filename,
              contents: fichier.contents,
            },
            fileRepo,
          })
            .map((responseFileId) => responseFileId)
            .mapErr((e: Error) => {
              logger.error(e);
              return new InfraNotAvailableError();
            });
        },
      )
      .andThen((fileId: string) => {
        return projectRepo.transaction(new UniqueEntityID(projectId), (project: Project) => {
          const appelOffreProjet = getProjectAppelOffre({
            appelOffreId: project.appelOffreId,
            periodeId: project.periodeId,
            familleId: project.familleId,
          });
          const exceedsRatios = exceedsRatiosChangementPuissance({
            nouvellePuissance: newPuissance,
            project: {
              ...project,
              appelOffre: appelOffreProjet,
              technologie: project.data?.technologie ?? 'N/A',
            },
          });
          const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({
            nouvellePuissance: newPuissance,
            project: { ...project },
          });

          const newPuissanceIsAutoAccepted = !exceedsRatios && !exceedsPuissanceMax;

          if (newPuissanceIsAutoAccepted) {
            return project.updatePuissance(requestedBy, newPuissance).asyncMap(async () => ({
              newPuissanceIsAutoAccepted,
              fileId,
              project,
            }));
          }

          if (
            (project.cahierDesCharges.type === 'initial' ||
              (project.cahierDesCharges.type === 'modifié' &&
                project.cahierDesCharges.paruLe !== '30/08/2022')) &&
            !fileId &&
            !justification
          ) {
            return errAsync(new PuissanceJustificationEtCourrierManquantError());
          }

          return okAsync({ newPuissanceIsAutoAccepted: false, fileId, project });
        });
      })
      .andThen(
        ({
          newPuissanceIsAutoAccepted,
          fileId,
          project,
        }): ResultAsync<null, AggregateHasBeenUpdatedSinceError | InfraNotAvailableError> => {
          const modificationRequestId = new UniqueEntityID().toString();

          return getPuissanceProjet(projectId.toString())
            .orElse(() => ok(-1))
            .andThen((puissanceActuelle) => {
              const puissanceAuMomentDuDepot =
                puissanceActuelle !== -1 ? puissanceActuelle : undefined;
              return eventBus.publish(
                newPuissanceIsAutoAccepted
                  ? new ModificationReceived({
                      payload: {
                        modificationRequestId,
                        projectId: projectId.toString(),
                        requestedBy: requestedBy.id,
                        type: 'puissance',
                        puissance: newPuissance,
                        puissanceAuMomentDuDepot,
                        justification,
                        fileId,
                        authority: 'dreal',
                        cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
                      },
                    })
                  : new ModificationRequested({
                      payload: {
                        modificationRequestId,
                        projectId: projectId.toString(),
                        requestedBy: requestedBy.id,
                        type: 'puissance',
                        puissance: newPuissance,
                        puissanceAuMomentDuDepot,
                        justification,
                        fileId,
                        authority: 'dreal',
                        cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
                      },
                    }),
              );
            });
        },
      );
  };
