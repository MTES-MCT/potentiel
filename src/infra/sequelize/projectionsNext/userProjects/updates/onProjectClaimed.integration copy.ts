import { UniqueEntityID } from '@core/domain';
import { ProjectClaimedByOwner } from '@modules/projectClaim';
import { resetDatabase } from '../../../helpers';
import models from '../../../models';
import { UserProjects } from '../userProjects.model';
import onProjectClaimed from './onProjectClaimed';

describe('userProjects.onProjectClaimed', () => {
  const projectId = new UniqueEntityID().toString();
  const claimedBy = new UniqueEntityID().toString();

  describe('on ProjectClaimedByOwner', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase();

      await onProjectClaimed(models)(
        new ProjectClaimedByOwner({
          payload: {
            projectId,
            claimedBy,
            claimerEmail: 'test@test.test',
          },
        }),
      );
    });

    it('should create a record for the specified userId and projectId', async () => {
      expect(await UserProjects.count({ where: { userId: claimedBy, projectId } })).toEqual(1);
    });
  });
});
