import { UniqueEntityID } from '@core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { isProjectParticipatif } from './isProjectParticipatif';
import { Project } from '@infra/sequelize/projectionsNext';

const projectId = new UniqueEntityID().toString();

describe('Sequelize isProjectParticipatif', () => {
  describe('when project is financement participatif', () => {
    it('should return true', async () => {
      await resetDatabase();

      await Project.create(
        makeFakeProject({
          id: projectId,
          isFinancementParticipatif: true,
          isInvestissementParticipatif: false,
        }),
      );

      expect((await isProjectParticipatif(projectId))._unsafeUnwrap()).toEqual(true);
    });
  });

  describe('when project is investissement participatif', () => {
    it('should return true', async () => {
      await resetDatabase();

      await Project.create(
        makeFakeProject({
          id: projectId,
          isFinancementParticipatif: false,
          isInvestissementParticipatif: true,
        }),
      );

      expect((await isProjectParticipatif(projectId))._unsafeUnwrap()).toEqual(true);
    });
  });

  describe('when project is neither investissement nor financement participatif', () => {
    it('should return true', async () => {
      await resetDatabase();

      await Project.create(
        makeFakeProject({
          id: projectId,
          isFinancementParticipatif: false,
          isInvestissementParticipatif: false,
        }),
      );

      expect((await isProjectParticipatif(projectId))._unsafeUnwrap()).toEqual(false);
    });
  });
});
