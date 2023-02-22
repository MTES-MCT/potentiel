import { UniqueEntityID } from '@core/domain';
import { ProjectClaimedByOwner } from '@modules/projectClaim';
import { resetDatabase } from '../../../helpers';
import { UserProjects } from '../userProjects.model';
import onProjectClaimedByOwner from './onProjectClaimedByOwner';

describe('userProjects.onProjectClaimed', () => {
  const projectId = new UniqueEntityID().toString();
  const claimedBy = new UniqueEntityID().toString();

  describe('on ProjectClaimedByOwner', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase();

      await onProjectClaimedByOwner(
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
