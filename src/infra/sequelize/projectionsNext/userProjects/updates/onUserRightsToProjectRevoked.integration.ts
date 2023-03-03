import { UniqueEntityID } from '@core/domain';
import { UserRightsToProjectRevoked } from '@modules/authZ';
import { resetDatabase } from '../../../helpers';
import onUserRightsToProjectRevoked from './onUserRightsToProjectRevoked';
import { UserProjects } from '@infra/sequelize/projectionsNext';

describe('userProjects.onUserRightsToProjectRevoked', () => {
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await UserProjects.bulkCreate([
      {
        userId,
        projectId,
      },
      {
        userId: new UniqueEntityID().toString(),
        projectId,
      },
      {
        userId,
        projectId: new UniqueEntityID().toString(),
      },
      {
        userId: new UniqueEntityID().toString(),
        projectId: new UniqueEntityID().toString(),
      },
    ]);
  });

  it('should remove all instances for this userId and projectId', async () => {
    expect(await UserProjects.count({ where: { userId, projectId } })).toEqual(1);
    expect(await UserProjects.count()).toEqual(4);

    const event = new UserRightsToProjectRevoked({
      payload: {
        projectId,
        userId,
        revokedBy: new UniqueEntityID().toString(),
      },
    });
    await onUserRightsToProjectRevoked(event);

    expect(await UserProjects.count({ where: { userId, projectId } })).toEqual(0);
    expect(await UserProjects.count()).toEqual(3);
  });
});
