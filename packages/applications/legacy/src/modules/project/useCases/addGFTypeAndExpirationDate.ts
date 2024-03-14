import { TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { errAsync, ResultAsync, wrapInfra } from '../../../core/utils';
import { User } from '../../../entities';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { NoGFCertificateToUpdateError, ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors';
import { Project } from '../Project';

type addGFExpidationDateDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  projectRepo: TransactionalRepository<Project>;
};

type addGFExpidationDateArgs = {
  dateEchéance?: Date;
  type: string;
  submittedBy: User;
  projectId: string;
};

export const PermissionAjouterTypeEtDateEcheanceGF = {
  nom: 'ajouter-date-expiration-gf',
  description: `Ajouter le type et la date d'échéance de garanties financières`,
};
export const makeAddGFTypeAndExpirationDate =
  (deps: addGFExpidationDateDeps) =>
  (
    args: addGFExpidationDateArgs,
  ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { shouldUserAccessProject, projectRepo } = deps;
    const { dateEchéance: expirationDate, submittedBy, projectId, type } = args;

    return wrapInfra(shouldUserAccessProject({ projectId, user: submittedBy })).andThen(
      (userHasRights): ResultAsync<null, UnauthorizedError> => {
        if (!userHasRights) return errAsync(new UnauthorizedError());
        return projectRepo.transaction(
          new UniqueEntityID(projectId),
          (
            project: Project,
          ): ResultAsync<
            null,
            ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToUpdateError
          > => {
            return project
              .addGFTypeAndExpirationDate({
                dateEchéance: expirationDate,
                submittedBy,
                projectId,
                type,
              })
              .asyncMap(async () => null);
          },
        );
      },
    );
  };
