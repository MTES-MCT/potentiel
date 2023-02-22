import { TransactionalRepository, UniqueEntityID } from '@core/domain';
import { errAsync, ResultAsync, wrapInfra } from '@core/utils';
import { User } from '@entities';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import {
  NoGFCertificateToDeleteError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  SuppressionGFValidéeImpossibleError,
} from '../errors';
import { Project } from '../Project';

interface RemoveGFDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  projectRepo: TransactionalRepository<Project>;
}

type RemoveGFArgs = {
  projectId: string;
  removedBy: User;
};

export const PermissionAnnulerGF = {
  nom: 'annuler-gf',
  description: 'Annuler les garanties financières',
};

export const makeRemoveGF =
  (deps: RemoveGFDeps) =>
  (args: RemoveGFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
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
            | ProjectCannotBeUpdatedIfUnnotifiedError
            | NoGFCertificateToDeleteError
            | SuppressionGFValidéeImpossibleError
          > => {
            return project.removeGarantiesFinancieres(removedBy).asyncMap(async () => null);
          },
        );
      },
    );
  };
