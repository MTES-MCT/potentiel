import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '../../../helpers';
import { ProjectClaimed } from '@modules/projectClaim';
import { UserProjects } from '../userProjects.model';
import onProjectClaimed from './onProjectClaimed';

describe('userProjects.onProjectClaimed', () => {
  const projectId = new UniqueEntityID().toString();
  const claimedBy = new UniqueEntityID().toString();

  describe('on ProjectClaimed', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase();

      await onProjectClaimed(
        new ProjectClaimed({
          payload: {
            projectId,
            claimedBy,
            claimerEmail: 'test@test.test',
            attestationDesignationFileId: new UniqueEntityID().toString(),
          },
        }),
      );
    });

    it('should create a record for the specified userId and projectId', async () => {
      expect(await UserProjects.count({ where: { userId: claimedBy, projectId } })).toEqual(1);
    });
  });
});
