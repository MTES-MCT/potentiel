import { errAsync, okAsync } from 'neverthrow';
import { EventStore, Repository, UniqueEntityID } from '@core/domain';
import { logger, wrapInfra, ResultAsync } from '@core/utils';
import { User, formatCahierDesChargesRéférence } from '@entities';
import { FileContents, FileObject, makeFileObject } from '@modules/file';
import { DélaiDemandé } from '@modules/demandeModification';
import { GetProjectAppelOffreId } from '@modules/modificationRequest';
import { AppelOffreRepo } from '@dataAccess';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { NumeroGestionnaireSubmitted, Project } from '@modules/project';

import { DemanderDateAchèvementAntérieureDateThéoriqueError } from '.';
import { NouveauCahierDesChargesNonChoisiError } from './NouveauCahierDesChargesNonChoisiError';

type DemanderDélai = (commande: {
  user: User;
  file?: {
    contents: FileContents;
    filename: string;
  };
  projectId: string;
  justification?: string;
  dateAchèvementDemandée: Date;
  numeroGestionnaire?: string;
}) => ResultAsync<
  null,
  InfraNotAvailableError | UnauthorizedError | DemanderDateAchèvementAntérieureDateThéoriqueError
>;

type MakeDemanderDélai = (dépendances: {
  fileRepo: Repository<FileObject>;
  findAppelOffreById: AppelOffreRepo['findById'];
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffreId: GetProjectAppelOffreId;
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  projectRepo: Repository<Project>;
}) => DemanderDélai;

export const makeDemanderDélai: MakeDemanderDélai =
  ({
    fileRepo,
    findAppelOffreById,
    publishToEventStore,
    shouldUserAccessProject,
    getProjectAppelOffreId,
    projectRepo,
  }) =>
  ({ user, projectId, file, justification, dateAchèvementDemandée, numeroGestionnaire }) => {
    return wrapInfra(
      shouldUserAccessProject({
        user,
        projectId,
      }),
    )
      .andThen((userHasRightsToProject) => {
        if (!userHasRightsToProject) {
          return errAsync(new UnauthorizedError());
        }

        return getProjectAppelOffreId(projectId).andThen((appelOffreId) => {
          return wrapInfra(findAppelOffreById(appelOffreId));
        });
      })
      .andThen((appelOffre) => {
        return projectRepo.load(new UniqueEntityID(projectId)).andThen((project) => {
          if (
            project.cahierDesCharges.type === 'initial' &&
            appelOffre?.choisirNouveauCahierDesCharges
          ) {
            return errAsync(new NouveauCahierDesChargesNonChoisiError());
          }
          if (dateAchèvementDemandée.getTime() <= project.completionDueOn) {
            return errAsync(
              new DemanderDateAchèvementAntérieureDateThéoriqueError(
                dateAchèvementDemandée,
                new Date(project.completionDueOn),
              ),
            );
          }
          return okAsync({
            appelOffre,
            project,
          });
        });
      })
      .andThen(({ appelOffre, project }) => {
        if (!file) return okAsync({ appelOffre, fileId: null, project });

        return makeFileObject({
          designation: 'modification-request',
          forProject: new UniqueEntityID(projectId),
          createdBy: new UniqueEntityID(user.id),
          filename: file.filename,
          contents: file.contents,
        })
          .asyncAndThen((file) =>
            fileRepo.save(file).map(() => ({
              appelOffre,
              fileId: file.id.toString(),
              project,
            })),
          )
          .mapErr((e: Error) => {
            logger.error(e);
            return new InfraNotAvailableError();
          });
      })
      .andThen(({ appelOffre, fileId, project }) => {
        return publishToEventStore(
          new DélaiDemandé({
            payload: {
              demandeDélaiId: new UniqueEntityID().toString(),
              projetId: projectId,
              ...(fileId && { fichierId: fileId }),
              justification,
              dateAchèvementDemandée,
              autorité: appelOffre?.type === 'eolien' ? 'dgec' : 'dreal',
              porteurId: user.id,
              cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
            },
          }),
        ).andThen(() => {
          if (numeroGestionnaire) {
            return publishToEventStore(
              new NumeroGestionnaireSubmitted({
                payload: { projectId, submittedBy: user.id, numeroGestionnaire },
              }),
            );
          }
          return okAsync(null);
        });
      });
  };
