import { beforeAll, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { FileNotFoundError } from '@modules/file';
import { resetDatabase } from '../../helpers';
import { getFileProject } from './getFileProject';
import { File } from '@infra/sequelize/projectionsNext';

describe('Sequelize getFileProject', () => {
  const fileWithoutProject = new UniqueEntityID();
  const fileWithProject = new UniqueEntityID();
  const projectId = new UniqueEntityID();

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await File.bulkCreate([
      {
        id: fileWithProject.toString(),
        filename: '',
        forProject: projectId.toString(),
        designation: 'other',
      },
      {
        id: fileWithoutProject.toString(),
        filename: '',
        designation: 'other',
      },
    ]);
  });

  describe('when the file has a project', () => {
    it('should return the projectId', async () => {
      const projectIdResult = await getFileProject(fileWithProject);

      expect(projectIdResult.isOk()).toBe(true);
      if (projectIdResult.isErr()) return;

      expect(projectIdResult.value).toEqual(projectId);
    });
  });

  describe('when the file has no project', () => {
    it('should return null', async () => {
      const projectIdResult = await getFileProject(fileWithoutProject);

      expect(projectIdResult.isOk()).toBe(true);
      if (projectIdResult.isErr()) return;

      expect(projectIdResult.value).toEqual(null);
    });
  });

  describe('when the file does not exist', () => {
    it('should return FileNotFoundError', async () => {
      const projectIdResult = await getFileProject(new UniqueEntityID());

      expect(projectIdResult.isErr()).toBe(true);
      if (projectIdResult.isOk()) return;

      expect(projectIdResult.error).toBeInstanceOf(FileNotFoundError);
    });
  });
});
