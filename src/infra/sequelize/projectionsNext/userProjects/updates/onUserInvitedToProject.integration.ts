import { UniqueEntityID } from '@core/domain';
import { UserInvitedToProject } from '@modules/authZ';
import { resetDatabase } from '../../../helpers';
import { UserProjects } from '@infra/sequelize/projectionsNext';
import onUserInvitedToProject from './onUserInvitedToProject';

describe('userProjects.onUserInvitedToProject', () => {
  const projectId1 = new UniqueEntityID().toString();
  const projectId2 = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  it('should create rows for each projectId', async () => {
    await resetDatabase();
    expect(await UserProjects.count()).toEqual(0);

    const event = new UserInvitedToProject({
      payload: {
        projectIds: [projectId1, projectId2],
        userId,
        invitedBy: new UniqueEntityID().toString(),
      },
    });
    await onUserInvitedToProject(event);

    expect(await UserProjects.count({ where: { userId, projectId: projectId1 } })).toEqual(1);
    expect(await UserProjects.count({ where: { userId, projectId: projectId2 } })).toEqual(1);
  });
});
