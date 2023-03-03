import { UniqueEntityID } from '@core/domain';
import { UserRightsToProjectGranted } from '@modules/authZ';
import { resetDatabase } from '../../../helpers';
import { UserProjects } from '@infra/sequelize/projectionsNext';
import onUserRightsToProjectGranted from './onUserRightsToProjectGranted';

describe('userProjects.onUserRightsToProjectGranted', () => {
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();
  });

  it('should create a line for this userId and projectId', async () => {
    expect(await UserProjects.count({ where: { userId, projectId } })).toEqual(0);

    await onUserRightsToProjectGranted(
      new UserRightsToProjectGranted({
        payload: {
          projectId,
          userId,
          grantedBy: '',
        },
      }),
    );

    expect(await UserProjects.count({ where: { userId, projectId } })).toEqual(1);
  });
});
