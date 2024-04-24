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

import {
  ExceedsPuissanceMaxDuVolumeReserve,
  ExceedsPuissanceMaxFamille,
  ExceedsRatiosChangementPuissance,
} from './helpers';
import {
  NouvellePuissanceAuDessusPuissanceFamilleError,
  NouvellePuissanceAuDessusPuissanceMaxVolumeReserveError,
  PuissanceJustificationEtCourrierManquantError,
} from '.';
import { GetProjectAppelOffre } from '../../../projectAppelOffre';
import { getAutoritéCompétenteInstructionPuissance } from './helpers/getAutoritéCompétenteInstructionPuissance';

type DemanderChangementDePuissance = (commande: {
  projectId: string;
  requestedBy: User;
  newPuissance: number;
  justification?: string;
  fichier?: { contents: FileContents; filename: string };
}) => ResultAsync<
  null,
  | PuissanceJustificationEtCourrierManquantError
  | NouvellePuissanceAuDessusPuissanceMaxVolumeReserveError
  | AggregateHasBeenUpdatedSinceError
  | EntityNotFoundError
  | UnauthorizedError
>;

type MakeDemanderChangementDePuissance = (dépendances: {
  eventBus: EventBus;
  exceedsRatiosChangementPuissance: ExceedsRatiosChangementPuissance;
  exceedsPuissanceMaxDuVolumeReserve: ExceedsPuissanceMaxDuVolumeReserve;
  exceedsPuissanceMaxFamille: ExceedsPuissanceMaxFamille;
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
    exceedsPuissanceMaxFamille,
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

          if (!appelOffreProjet) {
            return errAsync(new EntityNotFoundError());
          }

          const exceedsPuissanceMaxdeLaFamille = exceedsPuissanceMaxFamille({
            nouvellePuissance: newPuissance,
            project: {
              appelOffre: appelOffreProjet,
              familleId: project.familleId,
            },
          });

          if (exceedsPuissanceMaxdeLaFamille) {
            return errAsync(new NouvellePuissanceAuDessusPuissanceFamilleError());
          }

          const exceedsPuissanceMaxVolumeReserve = exceedsPuissanceMaxDuVolumeReserve({
            nouvellePuissance: newPuissance,
            project: {
              appelOffre: appelOffreProjet,
              désignationCatégorie: project.data?.désignationCatégorie,
            },
          });

          if (exceedsPuissanceMaxVolumeReserve) {
            return errAsync(new NouvellePuissanceAuDessusPuissanceMaxVolumeReserveError());
          }

          const exceedsRatios = exceedsRatiosChangementPuissance({
            nouvellePuissance: newPuissance,
            project: {
              ...project,
              appelOffre: appelOffreProjet,
              technologie: project.data?.technologie ?? 'N/A',
              cahierDesCharges: project.cahierDesCharges,
            },
          });

          if (!exceedsRatios) {
            return project.updatePuissance(requestedBy, newPuissance).asyncMap(async () => ({
              newPuissanceIsAutoAccepted: true,
              fileId,
              project,
              authority: 'dreal' as const,
            }));
          }

          if (!fileId || !justification) {
            return errAsync(new PuissanceJustificationEtCourrierManquantError());
          }

          const authority = getAutoritéCompétenteInstructionPuissance({
            nouvellePuissance: newPuissance,
            project: {
              ...project,
              appelOffre: appelOffreProjet,
              technologie: project.data?.technologie ?? 'N/A',
              cahierDesCharges: project.cahierDesCharges,
            },
          });

          return okAsync({ newPuissanceIsAutoAccepted: false, fileId, project, authority });
        });
      })
      .andThen(
        ({
          newPuissanceIsAutoAccepted,
          fileId,
          project,
          authority,
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
                        authority,
                        cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
                      },
                    }),
              );
            });
        },
      );
  };
