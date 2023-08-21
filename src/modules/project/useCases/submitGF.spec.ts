import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { Readable } from 'stream';
import { DomainEvent, Repository, UniqueEntityID } from '../../../core/domain';
import { okAsync } from '../../../core/utils';
import { makeUser } from '../../../entities';
import { FileObject } from '../../file';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { UnwrapForTest } from '../../../types';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { makeSubmitGF } from './submitGF';
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import { Project } from '../Project';

const projectId = new UniqueEntityID().toString();

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
};

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null));

const fakeProject = makeFakeProject();

const projectRepo = fakeTransactionalRepo(fakeProject as Project);

describe('submitGF use-case', () => {
  describe('when the user has rights on this project', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    };

    const gfDate = new Date(123);
    const expirationDate = new Date(456);

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true);

      fakePublish.mockClear();

      const submitGF = makeSubmitGF({
        fileRepo: fileRepo as Repository<FileObject>,
        shouldUserAccessProject,
        projectRepo,
      });

      const res = await submitGF({
        file: fakeFileContents,
        stepDate: gfDate,
        projectId,
        submittedBy: user,
        expirationDate,
      });

      expect(res.isOk()).toBe(true);

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      });
    });

    it('should save the attachment file', async () => {
      expect(fileRepo.save).toHaveBeenCalled();
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents);
    });

    it('should add the GF', () => {
      const fakeFile = fileRepo.save.mock.calls[0][0];
      expect(fakeProject.submitGarantiesFinancieres).toHaveBeenCalledWith(
        gfDate,
        fakeFile.id.toString(),
        user,
        expirationDate,
      );
    });
  });

  describe('When the user doesnt have rights on the project', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear();

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));

      const shouldUserAccessProject = jest.fn(async () => false);

      const fileRepo = {
        save: jest.fn<Repository<FileObject>['save']>(),
        load: jest.fn<Repository<FileObject>['load']>(),
      };

      const submitGF = makeSubmitGF({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
      });

      const res = await submitGF({
        file: fakeFileContents,
        stepDate: new Date(123),
        projectId,
        submittedBy: user,
        expirationDate: new Date(456),
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);

      expect(fakePublish).not.toHaveBeenCalled();
    });
  });
});
