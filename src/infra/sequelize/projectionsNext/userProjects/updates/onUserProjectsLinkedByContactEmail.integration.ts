import { UniqueEntityID } from '@core/domain';
import { UserProjectsLinkedByContactEmail } from '@modules/authZ';
import { resetDatabase } from '../../../helpers';
import { UserProjects } from '@infra/sequelize/projectionsNext';
import onUserProjectsLinkedByContactEmail from './onUserProjectsLinkedByContactEmail';

describe('userProjects.onUserProjectsLinkedByContactEmail', () => {
  const projectId1 = new UniqueEntityID().toString();
  const projectId2 = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  it('should create rows for each projectId', async () => {
    await resetDatabase();
    expect(await UserProjects.count()).toEqual(0);

    await onUserProjectsLinkedByContactEmail(
      new UserProjectsLinkedByContactEmail({
        payload: {
          projectIds: [projectId1, projectId2],
          userId,
        },
      }),
    );

    expect(await UserProjects.count({ where: { userId, projectId: projectId1 } })).toEqual(1);
    expect(await UserProjects.count({ where: { userId, projectId: projectId2 } })).toEqual(1);
  });
});
