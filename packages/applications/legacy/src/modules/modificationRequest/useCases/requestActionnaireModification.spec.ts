import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Readable } from 'stream';
import { DomainEvent, Repository } from '../../../core/domain';
import { okAsync } from '../../../core/utils';
import { makeUser } from '../../../entities';
import { UnwrapForTest } from '../../../types';
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { FileObject } from '../../file';
import { Project } from '../../project';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { ModificationReceived, ModificationRequested } from '../events';
import { makeRequestActionnaireModification } from './requestActionnaireModification';

describe('requestActionnaireModification use-case', () => {
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));

  const fakeProject = {
    ...makeFakeProject(),
    actionnaire: 'initial actionnaire',
    cahierDesCharges: { type: 'initial' },
    numéroCRE: '123',
  };

  const projectRepo = fakeTransactionalRepo(fakeProject as Project);

  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null));

  const eventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  };
  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  };

  const fakeFileContents = Readable.from('test-content');
  const fakeFileName = 'myfilename.pdf';

  beforeEach(() => {
    fakePublish.mockClear();
    fakeProject.updateActionnaire.mockClear();
    fileRepo.save.mockClear();
  });

  describe('Utilisateur non autorisé', () => {
    it(`Etant donné un projet
        Lorsqu'un utilisateur qui n'a pas les droits sur ce projet demande un changement d'actionnaire
        Alors l'utilisateur devrait être informé qu'il n'a pas les droits sur le projet`, async () => {
      const shouldUserAccessProject = jest.fn(async () => false);

      const requestActionnaireModification = makeRequestActionnaireModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
      });

      const res = await requestActionnaireModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newActionnaire: 'new actionnaire',
        file: { contents: fakeFileContents, filename: fakeFileName },
        soumisAuxGarantiesFinancières: 'à la candidature',
        nécessiteInstruction: true,
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);
      expect(fakePublish).not.toHaveBeenCalled();
    });
  });

  describe('Utilisateur autorisé', () => {
    // contexte global
    const shouldUserAccessProject = jest.fn(async () => true);
    const newActionnaire = 'new actionnaire';

    describe(`Contexte nécessitant une validation du changement d'actionnaire`, () => {
      it(`Etant donné un projet dont les garanties financières sont à soumettre après candidature
          Et dont les garanties financières n'ont pas encore été déposées par le porteur
          Lorsque le porteur demande un changement d'actionnaire
          Alors une validation de sa demande est attendue
          Et l'actionnaire n'est pas modifié automatiquement 
          `, async () => {
        const requestActionnaireModification = makeRequestActionnaireModification({
          projectRepo,
          eventBus,
          shouldUserAccessProject,
          fileRepo: fileRepo as Repository<FileObject>,
        });

        const res = await requestActionnaireModification({
          projectId: fakeProject.id,
          requestedBy: fakeUser,
          newActionnaire,
          file: { contents: fakeFileContents, filename: fakeFileName },
          soumisAuxGarantiesFinancières: 'après candidature',
          garantiesFinancièresConstituées: false,
          nécessiteInstruction: true,
        });

        expect(res.isOk()).toBe(true);

        expect(eventBus.publish).toHaveBeenCalledTimes(1);
        const event = eventBus.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(ModificationRequested);
        expect(event).toMatchObject({
          payload: {
            type: 'actionnaire',
            actionnaire: newActionnaire,
            cahierDesCharges: 'initial',
          },
        });

        expect(fakeProject.updateActionnaire).not.toHaveBeenCalled();
      });

      it(`Etant donné un projet "participatif"
          Et dont les garanties financières sont à soumettre après candidature
          Et dont les garanties financières ont été déposées par le porteur
          Lorsque le porteur demande un changement d'actionnaire
          Alors une validation de sa demande est attendue
          Et l'actionnaire n'est pas modifié automatiquement 
          `, async () => {
        const projectFixture = makeFakeProject();
        const fakeProject = {
          ...projectFixture,
          actionnaire: 'initial actionnaire',
          cahierDesCharges: { type: 'initial' },
          numéroCRE: '123',
          data: { ...projectFixture.data, isFinancementParticipatif: true },
        };

        const projectRepo = fakeTransactionalRepo(fakeProject as Project);

        const requestActionnaireModification = makeRequestActionnaireModification({
          projectRepo,
          eventBus,
          shouldUserAccessProject,
          fileRepo: fileRepo as Repository<FileObject>,
        });

        const res = await requestActionnaireModification({
          projectId: fakeProject.id,
          requestedBy: fakeUser,
          newActionnaire,
          file: { contents: fakeFileContents, filename: fakeFileName },
          soumisAuxGarantiesFinancières: 'après candidature',
          garantiesFinancièresConstituées: true,
          nécessiteInstruction: true,
        });

        expect(res.isOk()).toBe(true);

        expect(eventBus.publish).toHaveBeenCalledTimes(1);
        const event = eventBus.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(ModificationRequested);
        expect(event).toMatchObject({
          payload: {
            type: 'actionnaire',
            actionnaire: newActionnaire,
            cahierDesCharges: 'initial',
          },
        });

        expect(fakeProject.updateActionnaire).not.toHaveBeenCalled();
      });
    });

    describe(`Contexte permettant un changement automatique d'actionnaire`, () => {
      it(`Etant donné un projet non "participatif"
          Et dont les garanties financières sont à soumettre après candidature
          Et dont les garanties financières ont été déposées par le porteur
          Lorsque le porteur demande un changement d'actionnaire
          Alors l'actionnaire est modifié automatiquement 
          Et aucune validation du changemnet n'est attendue
          `, async () => {
        const fakeProject = {
          ...makeFakeProject(),
          actionnaire: 'initial actionnaire',
          cahierDesCharges: { type: 'initial' },
          isParticipatif: false,
          numéroCRE: '123',
        };

        const projectRepo = fakeTransactionalRepo(fakeProject as Project);

        const requestActionnaireModification = makeRequestActionnaireModification({
          projectRepo,
          eventBus,
          shouldUserAccessProject,
          fileRepo: fileRepo as Repository<FileObject>,
        });

        const res = await requestActionnaireModification({
          projectId: fakeProject.id,
          requestedBy: fakeUser,
          newActionnaire,
          file: { contents: fakeFileContents, filename: fakeFileName },
          soumisAuxGarantiesFinancières: 'après candidature',
          garantiesFinancièresConstituées: true,
          nécessiteInstruction: true,
        });

        expect(res.isOk()).toBe(true);

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user: fakeUser,
          projectId: fakeProject.id.toString(),
        });

        expect(eventBus.publish).toHaveBeenCalledTimes(1);
        const event = eventBus.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(ModificationReceived);
        expect(event).toMatchObject({
          payload: {
            type: 'actionnaire',
            actionnaire: newActionnaire,
            cahierDesCharges: 'initial',
          },
        });

        expect(fakeProject.updateActionnaire).toHaveBeenCalledWith(fakeUser, 'new actionnaire');

        expect(fileRepo.save).toHaveBeenCalledTimes(1);
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents);
        expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFileName);
      });

      it(`Etant donné un projet dont les garanties financières sont soumises à la candidature
          Lorsque le porteur demande un changement d'actionnaire
          Alors l'actionnaire est modifié automatiquement 
          Et aucune validation du changemnet n'est attendue
          `, async () => {
        const requestActionnaireModification = makeRequestActionnaireModification({
          projectRepo,
          eventBus,
          shouldUserAccessProject,
          fileRepo: fileRepo as Repository<FileObject>,
        });

        const res = await requestActionnaireModification({
          projectId: fakeProject.id,
          requestedBy: fakeUser,
          newActionnaire,
          file: { contents: fakeFileContents, filename: fakeFileName },
          soumisAuxGarantiesFinancières: 'à la candidature',
          nécessiteInstruction: true,
        });

        expect(res.isOk()).toBe(true);

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user: fakeUser,
          projectId: fakeProject.id.toString(),
        });

        expect(eventBus.publish).toHaveBeenCalledTimes(1);
        const event = eventBus.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(ModificationReceived);
        expect(event).toMatchObject({
          payload: {
            type: 'actionnaire',
            actionnaire: newActionnaire,
            cahierDesCharges: 'initial',
          },
        });

        expect(fakeProject.updateActionnaire).toHaveBeenCalledWith(fakeUser, 'new actionnaire');

        expect(fileRepo.save).toHaveBeenCalledTimes(1);
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents);
        expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFileName);
      });
    });
    it(`Etant donné un projet non soumis à garanties financières
          Lorsque le porteur demande un changement d'actionnaire
          Alors l'actionnaire est modifié automatiquement 
          Et aucune validation du changemnet n'est attendue
          `, async () => {
      const requestActionnaireModification = makeRequestActionnaireModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
      });

      const res = await requestActionnaireModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newActionnaire,
        file: { contents: fakeFileContents, filename: fakeFileName },
        soumisAuxGarantiesFinancières: 'non soumis',
        nécessiteInstruction: true,
      });

      expect(res.isOk()).toBe(true);

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user: fakeUser,
        projectId: fakeProject.id.toString(),
      });

      expect(eventBus.publish).toHaveBeenCalledTimes(1);
      const event = eventBus.publish.mock.calls[0][0];
      expect(event).toBeInstanceOf(ModificationReceived);
      expect(event).toMatchObject({
        payload: {
          type: 'actionnaire',
          actionnaire: newActionnaire,
          cahierDesCharges: 'initial',
        },
      });

      expect(fakeProject.updateActionnaire).toHaveBeenCalledWith(fakeUser, 'new actionnaire');

      expect(fileRepo.save).toHaveBeenCalledTimes(1);
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents);
      expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFileName);
    });
  });
});
