import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { okAsync } from '../../../core/utils';
import { makeUser } from '../../../entities';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { UnwrapForTest } from '../../../types';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { makeAddGFTypeAndExpirationDate } from './addGFTypeAndExpirationDate';
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import { Project } from '../Project';

const projectId = new UniqueEntityID().toString();

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null));

const fakeProject = makeFakeProject();

const projectRepo = fakeTransactionalRepo(fakeProject as Project);

describe(`Ajouter une date d'échéance à une garantie financière`, () => {
  beforeEach(() => {
    fakePublish.mockClear();
  });
  describe("Ajout impossible si l'utilisateur n'a pas les droits sur le projet", () => {
    it(`Étant donné un utilisateur n'ayant pas accès au projet
        Lorsqu'il ajoute une date d'échéance à une garantie financière
        Alors une erreur UnauthorizedError devrait être retournée`, async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser()));
      const shouldUserAccessProject = jest.fn(async () => false);
      const addGFExpirationDate = makeAddGFTypeAndExpirationDate({
        shouldUserAccessProject,
        projectRepo,
      });

      const res = await addGFExpirationDate({
        projectId,
        submittedBy: user,
        dateEchéance: new Date('2022-05-16'),
        type: "Garantie financière avec date d'échéance et à renouveler",
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);

      expect(fakePublish).not.toHaveBeenCalled();
    });
  });

  describe("Suppression possible si l'utilisateur a les droits sur le projet", () => {
    it(`Étant donné un utilisateur ayant accès au projet
        Lorsqu'il ajoute un type et une date d'échéance à une garantie financière
        Alors le type et la date d'échéance devraient être ajoutés à garantie financière`, async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser()));
      const shouldUserAccessProject = jest.fn(async () => true);

      const addGFTypeAndExpirationDate = makeAddGFTypeAndExpirationDate({
        shouldUserAccessProject,
        projectRepo,
      });

      const res = await addGFTypeAndExpirationDate({
        projectId,
        submittedBy: user,
        dateEchéance: new Date('2022-05-16'),
        type: "Garantie financière avec date d'échéance et à renouveler",
      });

      expect(res.isOk()).toBe(true);
      expect(fakeProject.addGFTypeAndExpirationDate).toHaveBeenCalled();
      expect(fakeProject.addGFTypeAndExpirationDate).toHaveBeenCalledWith({
        projectId,
        submittedBy: user,
        dateEchéance: new Date('2022-05-16'),
        type: "Garantie financière avec date d'échéance et à renouveler",
      });
    });
  });
});
