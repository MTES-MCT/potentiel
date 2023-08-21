import { EventStore, UniqueEntityID, Repository } from '../../../core/domain';
import { errAsync, ResultAsync, wrapInfra } from '../../../core/utils';
import { User } from '../../../entities';
import { userIs } from '../../users';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { GarantiesFinancièresInvalidées } from '../events';
import { Project } from '../Project';
import { GFDéjàInvalidéesError } from '../errors';

interface InvaliderGFDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;

  publishToEventStore: EventStore['publish'];
  projectRepo: Repository<Project>;
}

type InvaliderGFArgs = {
  projetId: string;
  invalidéesPar: User;
};

export const PermissionInvaliderGF = {
  nom: 'invalider-gf',
  description: 'Invalider les garanties financières',
};

export const makeInvaliderGF =
  ({ projectRepo, shouldUserAccessProject, publishToEventStore }: InvaliderGFDeps) =>
  (args: InvaliderGFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projetId, invalidéesPar } = args;

    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: invalidéesPar })).andThen(
      (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject || !userIs('dreal')(invalidéesPar)) {
          return errAsync(new UnauthorizedError());
        }

        return projectRepo.load(new UniqueEntityID(projetId)).andThen((projet) => {
          if (!projet.GFValidées) {
            return errAsync(new GFDéjàInvalidéesError());
          }

          return publishToEventStore(
            new GarantiesFinancièresInvalidées({
              payload: { projetId, invalidéesPar: invalidéesPar.id },
            }),
          );
        });
      },
    );
  };
