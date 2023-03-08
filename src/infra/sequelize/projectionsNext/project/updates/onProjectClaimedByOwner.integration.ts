import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { UniqueEntityID } from '@core/domain';
import { onProjectClaimedByOwner } from './onProjectClaimedByOwner';
import { ProjectClaimedByOwner } from '@modules/projectClaim';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectClaimedByOwner', () => {
  const projectId = new UniqueEntityID().toString();

  const fakeProject = makeFakeProject({
    id: projectId,
    email: 'old@test.test',
  });

  describe('on ProjectClaimedByOwner', () => {
    beforeAll(async () => {
      await resetDatabase();
      await Project.create(fakeProject);

      const originalProject = await Project.findByPk(projectId);
      expect(originalProject?.email).toEqual('old@test.test');

      await onProjectClaimedByOwner(
        new ProjectClaimedByOwner({
          payload: {
            projectId: projectId,
            claimedBy: new UniqueEntityID().toString(),
            claimerEmail: 'new@test.test',
          },
        }),
      );
    });

    it('should udpdate the project email', async () => {
      const updatedProject = await Project.findByPk(projectId);
      expect(updatedProject?.email).toEqual('new@test.test');
    });
  });
});
