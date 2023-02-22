import { DomainEvent, UniqueEntityID } from '@core/domain';
import { okAsync } from '@core/utils';
import { makeUser } from '@entities';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { UnwrapForTest } from '../../../types';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { makeRemoveGF } from './removeGF';
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import { Project } from '../Project';

const projectId = new UniqueEntityID().toString();

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null));

const fakeProject = makeFakeProject();

const projectRepo = fakeTransactionalRepo(fakeProject as Project);

describe('Supprimer une garantie financière', () => {
  beforeEach(() => {
    return fakePublish.mockClear();
  });

  describe(`Suppression impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    it(`Étant donné un utilisateur n'ayant pas accès au projet
          Lorsqu'il supprime une garantie financière
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser()));

      const shouldUserAccessProject = jest.fn(async () => false);

      const removeGF = makeRemoveGF({
        shouldUserAccessProject,
        projectRepo,
      });

      const res = await removeGF({
        projectId,
        removedBy: user,
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);

      expect(fakePublish).not.toHaveBeenCalled();
    });
  });

  describe(`Suppression possible si l'utilisateur a les droits sur le projet`, () => {
    it(`Étant donné un utilisateur ayant accès au projet
          Lorsqu'il supprime une garantie financière
          Alors la garantie financière devrait être supprimée`, async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser()));
      const shouldUserAccessProject = jest.fn(async () => true);

      const removeGF = makeRemoveGF({
        shouldUserAccessProject,
        projectRepo,
      });

      const res = await removeGF({
        projectId,
        removedBy: user,
      });
      expect(res.isOk()).toBe(true);

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      });

      expect(fakeProject.removeGarantiesFinancieres).toHaveBeenCalledWith(user);
    });
  });
});
