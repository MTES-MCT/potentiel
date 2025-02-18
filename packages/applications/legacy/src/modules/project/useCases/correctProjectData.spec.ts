import { describe, expect, it, jest } from '@jest/globals';
import { Repository, UniqueEntityID } from '../../../core/domain';
import { makeUser } from '../../../entities';
import { UnwrapForTest } from '../../../types';
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { FileObject } from '../../file';
import { UnauthorizedError } from '../../shared';
import { ProjectHasBeenUpdatedSinceError } from '../errors';
import { Project } from '../Project';
import { makeCorrectProjectData } from './correctProjectData';

const projectId = 'project1';

describe('correctProjectData', () => {
  describe('when user is not admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));

    const fakeProject = { ...makeFakeProject(), id: new UniqueEntityID(projectId) };

    const projectRepo = fakeTransactionalRepo(fakeProject as Project);

    const fileRepo = {
      save: jest.fn<Repository<FileObject>['save']>(),
      load: jest.fn<Repository<FileObject>['load']>(),
    };

    const correctProjectData = makeCorrectProjectData({
      projectRepo,
      fileRepo,
    });

    it('should return an UnauthorizedError', async () => {
      const res = await correctProjectData({
        projectId,
        projectVersionDate: new Date(),
        user,
        correctedData: {
          nomProjet: 'test',
        },
      });

      expect(res.isErr()).toEqual(true);
      if (res.isOk()) return;
      expect(res.error).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe('when user is admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })));

    describe('when project has been updated since', () => {
      const fakeProject = {
        ...makeFakeProject(),
        id: new UniqueEntityID(projectId),
        lastUpdatedOn: new Date(1),
      };
      const projectRepo = fakeTransactionalRepo(fakeProject as Project);
      const fileRepo = {
        save: jest.fn<Repository<FileObject>['save']>(),
        load: jest.fn<Repository<FileObject>['load']>(),
      };

      const correctProjectData = makeCorrectProjectData({
        projectRepo,
        fileRepo,
      });

      it('should return a ProjectHasBeenUpdatedSinceError', async () => {
        const res = await correctProjectData({
          projectId: projectId,
          projectVersionDate: new Date(0), // before new Date(1)
          user,
          correctedData: {},
        });

        expect(res.isErr()).toEqual(true);
        if (res.isOk()) return;
        expect(res.error).toBeInstanceOf(ProjectHasBeenUpdatedSinceError);
      });
    });
  });
});
