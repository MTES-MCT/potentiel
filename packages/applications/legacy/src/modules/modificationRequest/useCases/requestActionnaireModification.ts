import {
  EventBus,
  Repository,
  TransactionalRepository,
  UniqueEntityID,
} from '../../../core/domain';
import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '../../../core/utils';
import { User, formatCahierDesChargesRéférence } from '../../../entities';
import { FileContents, FileObject, makeAndSaveFile } from '../../file';
import { Project } from '../../project';
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared';
import { ModificationReceived, ModificationRequested } from '../events';

type RequestActionnaireModificationDeps = {
  eventBus: EventBus;
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  projectRepo: TransactionalRepository<Project>;
  fileRepo: Repository<FileObject>;
};

type RequestActionnaireModificationArgs = {
  projectId: UniqueEntityID;
  requestedBy: User;
  newActionnaire: string;
  justification?: string;
  file: { contents: FileContents; filename: string };
} & (
  | {
      soumisAuxGarantiesFinancières: 'non soumis' | 'à la candidature';
      nécessiteInstruction: true;
    }
  | {
      soumisAuxGarantiesFinancières: 'après candidature';
      garantiesFinancièresConstituées: boolean;
      nécessiteInstruction: true;
    }
  | {
      soumisAuxGarantiesFinancières: undefined;
      nécessiteInstruction: false;
    }
);

export const makeRequestActionnaireModification =
  (deps: RequestActionnaireModificationDeps) =>
  (
    args: RequestActionnaireModificationArgs,
  ): ResultAsync<
    null,
    | AggregateHasBeenUpdatedSinceError
    | InfraNotAvailableError
    | EntityNotFoundError
    | UnauthorizedError
  > => {
    const {
      projectId,
      requestedBy,
      newActionnaire,
      justification,
      file,
      soumisAuxGarantiesFinancières,
      nécessiteInstruction,
    } = args;
    const { eventBus, shouldUserAccessProject, projectRepo, fileRepo } = deps;

    return wrapInfra(
      shouldUserAccessProject({ projectId: projectId.toString(), user: requestedBy }),
    )
      .andThen((userHasRightsToProject) => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError());
        return makeAndSaveFile({
          file: {
            designation: 'modification-request',
            forProject: projectId,
            createdBy: new UniqueEntityID(requestedBy.id),
            filename: file.filename,
            contents: file.contents,
          },
          fileRepo,
        })
          .map((responseFileId) => responseFileId)
          .mapErr((e: Error) => {
            logger.error(e);
            return new InfraNotAvailableError();
          });
      })
      .andThen((fileId) =>
        projectRepo.transaction(projectId, (project: Project) => {
          if (nécessiteInstruction && soumisAuxGarantiesFinancières === 'après candidature') {
            if (
              project.data?.isFinancementParticipatif ||
              project.data?.isInvestissementParticipatif ||
              !args.garantiesFinancièresConstituées
            ) {
              return eventBus.publish(
                new ModificationRequested({
                  payload: {
                    modificationRequestId: new UniqueEntityID().toString(),
                    projectId: projectId.toString(),
                    requestedBy: requestedBy.id,
                    type: 'actionnaire',
                    actionnaire: newActionnaire,
                    justification,
                    fileId,
                    authority: 'dreal',
                    cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
                  },
                }),
              );
            }
          }

          project.updateActionnaire(requestedBy, newActionnaire);

          eventBus.publish(
            new ModificationReceived({
              payload: {
                modificationRequestId: new UniqueEntityID().toString(),
                projectId: projectId.toString(),
                requestedBy: requestedBy.id,
                type: 'actionnaire',
                actionnaire: newActionnaire,
                justification,
                fileId,
                authority: 'dreal',
                cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
              },
            }),
          );
          return okAsync(null);
        }),
      );
  };
