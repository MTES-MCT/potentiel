import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { UserRightsToProjectRevoked } from '@modules/authZ';
import { resetDatabase } from '../../../helpers';
import onUserRightsToProjectRevoked from './onUserRightsToProjectRevoked';
import { User, UserProjects } from '@infra/sequelize/projectionsNext';

describe('userProjects.onUserRightsToProjectRevoked', () => {
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
    await User.create({ id: userId, email: 'utilisateur@email.com', role: 'porteur-projet' });

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

  describe(`Gestion des doublons`, () => {
    it(`Étant donné un utilisateur en doublon avec les même droits
        Lorsque les droits d'un utilisateur sont revoqués pour un projet
        Alors chaque occurence de l'utilisateur ne devrait plus avoir les droits d'accès pour le projet`, async () => {
      const duplicatedUserId = new UniqueEntityID().toString();
      await User.create({
        id: duplicatedUserId,
        email: 'utilisateur@email.com',
        role: 'porteur-projet',
      });
      await UserProjects.bulkCreate([
        {
          userId: duplicatedUserId,
          projectId,
        },
        {
          userId: duplicatedUserId,
          projectId: new UniqueEntityID().toString(),
        },
      ]);

      await onUserRightsToProjectRevoked(
        new UserRightsToProjectRevoked({
          payload: {
            projectId,
            userId,
            revokedBy: '',
          },
        }),
      );

      expect(
        await UserProjects.findOne({
          where: { userId, projectId },
          attributes: ['userId', 'projectId'],
          raw: true,
        }),
      ).toBeNull();

      expect(
        await UserProjects.findOne({
          where: { userId: duplicatedUserId, projectId },
          attributes: ['userId', 'projectId'],
          raw: true,
        }),
      ).toBeNull();
    });
  });
});
