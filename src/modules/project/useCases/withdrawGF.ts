import { TransactionalRepository, UniqueEntityID } from '@core/domain';
import { errAsync, ResultAsync, wrapInfra } from '@core/utils';
import { User } from '@entities';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { NoGFCertificateToDeleteError, ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors';
import { Project } from '../Project';

interface WithdrawGFDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  projectRepo: TransactionalRepository<Project>;
}

type WithdrawGFArgs = {
  projectId: string;
  removedBy: User;
};

export const PermissionRetirerGF = {
  nom: 'retirer-gf',
  description: 'Retirer les garanties financières',
};

export const makeWithdrawGF =
  (deps: WithdrawGFDeps) =>
  (args: WithdrawGFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projectId, removedBy } = args;
    const { shouldUserAccessProject, projectRepo } = deps;

    return wrapInfra(shouldUserAccessProject({ projectId, user: removedBy })).andThen(
      (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError());
        return projectRepo.transaction(
          new UniqueEntityID(projectId),
          (
            project: Project,
          ): ResultAsync<
            null,
            ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError
          > => {
            return project.withdrawGarantiesFinancieres(removedBy).asyncMap(async () => null);
          },
        );
      },
    );
  };
