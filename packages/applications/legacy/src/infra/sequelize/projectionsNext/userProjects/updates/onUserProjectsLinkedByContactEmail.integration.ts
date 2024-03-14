import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import { UserProjectsLinkedByContactEmail } from '../../../../../modules/authZ';
import { resetDatabase } from '../../../helpers';
import { User, UserProjects } from '../..';
import onUserProjectsLinkedByContactEmail from './onUserProjectsLinkedByContactEmail';

describe('userProjects.onUserProjectsLinkedByContactEmail', () => {
  const projectId1 = new UniqueEntityID().toString();
  const projectId2 = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
    await User.create({ id: userId, email: 'utilisateur@email.com', role: 'porteur-projet' });
  });

  it('should create rows for each projectId', async () => {
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

  describe(`Gestion des utilisateurs en doublons`, () => {
    it(`Étant donné un utilisateur en doublon
        Lorsque l'utilisateur est lié par email sur des projets
        Alors chaque occurence de l'utilisateur devrait être invitée pour chaque projet`, async () => {
      const duplicatedUserId = new UniqueEntityID().toString();
      await User.create({
        id: duplicatedUserId,
        email: 'utilisateur@email.com',
        role: 'porteur-projet',
      });

      await onUserProjectsLinkedByContactEmail(
        new UserProjectsLinkedByContactEmail({
          payload: {
            projectIds: [projectId1, projectId2],
            userId,
          },
        }),
      );

      expect(
        await UserProjects.findAll({
          where: { userId },
          attributes: ['userId', 'projectId'],
          raw: true,
        }),
      ).toEqual(
        expect.arrayContaining([
          { userId, projectId: projectId1 },
          { userId, projectId: projectId2 },
        ]),
      );

      expect(
        await UserProjects.findAll({
          where: { userId: duplicatedUserId },
          attributes: ['userId', 'projectId'],
          raw: true,
        }),
      ).toEqual(
        expect.arrayContaining([
          { userId: duplicatedUserId, projectId: projectId1 },
          { userId: duplicatedUserId, projectId: projectId2 },
        ]),
      );
    });
  });
});
