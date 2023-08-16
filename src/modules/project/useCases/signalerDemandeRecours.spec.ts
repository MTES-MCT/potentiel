import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { DomainEvent, Repository, UniqueEntityID } from '../../../core/domain';
import { okAsync } from '../../../core/utils';
import { makeUser } from '../../../entities';
import { FileObject } from '../../file';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { UnwrapForTest } from '../../../types';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { makeSignalerDemandeRecours } from './signalerDemandeRecours';
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import { Project } from '../Project';
import { Readable } from 'stream';
import { DemandeDeMêmeTypeDéjàOuverteError } from '../errors';

const projectId = new UniqueEntityID().toString();
const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
};

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null));

const fakeProject = makeFakeProject();

const projectRepo = fakeTransactionalRepo(fakeProject as Project);

const hasDemandeDeMêmeTypeOuverte = jest.fn(() => okAsync(false));

describe('Commande signalerDemandeRecours', () => {
  describe(`Lorsque l'utilisateur n'a pas les droits sur le projet`, () => {
    it('Alors une erreur UnauthorizedError devrait être retournée', async () => {
      fakePublish.mockClear();

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));

      const shouldUserAccessProject = jest.fn(async () => false);

      const fileRepo = {
        save: jest.fn<Repository<FileObject>['save']>(),
        load: jest.fn<Repository<FileObject>['load']>(),
      };

      const signalerDemandeRecours = makeSignalerDemandeRecours({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
        hasDemandeDeMêmeTypeOuverte,
      });

      const res = await signalerDemandeRecours({
        projectId,
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        signaledBy: user,
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);

      expect(fakePublish).not.toHaveBeenCalled();
    });
  });
  describe(`Lorsque l'utilisateur a les droits sur le projet,
  mais qu'une demande de recours faite dans Potentiel est à traiter`, () => {
    it('Alors une erreur DemandeDeMêmeTypeDéjàOuverteError devrait être retournée', async () => {
      fakePublish.mockClear();

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));

      const shouldUserAccessProject = jest.fn(async () => true);

      const hasDemandeDeMêmeTypeOuverte = jest.fn(() => okAsync(true));

      const fileRepo = {
        save: jest.fn<Repository<FileObject>['save']>(),
        load: jest.fn<Repository<FileObject>['load']>(),
      };

      const signalerDemandeRecours = makeSignalerDemandeRecours({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
        hasDemandeDeMêmeTypeOuverte,
      });

      const res = await signalerDemandeRecours({
        projectId,
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        signaledBy: user,
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(DemandeDeMêmeTypeDéjàOuverteError);

      expect(fakePublish).not.toHaveBeenCalled();
    });
  });
  describe(`Lorsque l'utilisateur a les droits sur le projet
  et qu'aucune demande de recours est en attente`, () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    };

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true);

      fakePublish.mockClear();

      const signalerDemandeRecours = makeSignalerDemandeRecours({
        fileRepo: fileRepo as Repository<FileObject>,
        shouldUserAccessProject,
        projectRepo,
        hasDemandeDeMêmeTypeOuverte,
      });

      const res = await signalerDemandeRecours({
        projectId,
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        notes: 'notes',
        file: fakeFileContents,
        signaledBy: user,
      });

      expect(res.isOk()).toBe(true);

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      });
    });

    it('Alors le fichier devrait être sauvegardé', async () => {
      expect(fileRepo.save).toHaveBeenCalled();
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents);
    });

    it('Alors la méthode project.signalerDemandRecours devrait être appelée', () => {
      const fakeFile = fileRepo.save.mock.calls[0][0];
      expect(fakeProject.signalerDemandeRecours).toHaveBeenCalledWith({
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        notes: 'notes',
        attachment: { id: fakeFile.id.toString(), name: fakeFileContents.filename },
        signaledBy: user,
      });
    });
  });
});
