import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { ProjectClaimedByOwner } from '@modules/projectClaim';
import { resetDatabase } from '../../../helpers';
import { User, UserProjects } from '@infra/sequelize/projectionsNext';
import onProjectClaimedByOwner from './onProjectClaimedByOwner';

describe('userProjects.onProjectClaimedByOwner', () => {
  const projectId = new UniqueEntityID().toString();
  const claimedBy = new UniqueEntityID().toString();

  describe('on onProjectClaimedByOwner', () => {
    beforeEach(async () => {
      await resetDatabase();
      await User.create({ id: claimedBy, email: 'utilisateur@email.com', role: 'porteur-projet' });
    });

    it('should create a record for the specified userId and projectId', async () => {
      await onProjectClaimedByOwner(
        new ProjectClaimedByOwner({
          payload: {
            projectId,
            claimedBy,
            claimerEmail: 'test@test.test',
          },
        }),
      );

      expect(await UserProjects.count({ where: { userId: claimedBy, projectId } })).toEqual(1);
    });
    describe(`Gestion des doublons`, () => {
      it(`Étant donné un utilisateur en doublon
        Lorsqu'un utilisateur réclame un projet
        Alors chaque occurence de l'utilisateur devrait avoir les droits d'accès pour le projet`, async () => {
        const duplicatedUserId = new UniqueEntityID().toString();
        await User.create({
          id: duplicatedUserId,
          email: 'utilisateur@email.com',
          role: 'porteur-projet',
        });

        await onProjectClaimedByOwner(
          new ProjectClaimedByOwner({
            payload: {
              projectId,
              claimedBy,
              claimerEmail: 'test@test.test',
            },
          }),
        );

        expect(
          await UserProjects.findOne({
            where: { userId: claimedBy },
            attributes: ['userId', 'projectId'],
            raw: true,
          }),
        ).toEqual({ userId: claimedBy, projectId });

        expect(
          await UserProjects.findOne({
            where: { userId: duplicatedUserId },
            attributes: ['userId', 'projectId'],
            raw: true,
          }),
        ).toEqual({ userId: duplicatedUserId, projectId });
      });
    });
  });
});
