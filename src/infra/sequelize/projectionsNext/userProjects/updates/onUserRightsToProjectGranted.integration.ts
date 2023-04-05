import { UniqueEntityID } from '@core/domain';
import { UserRightsToProjectGranted } from '@modules/authZ';
import { resetDatabase } from '../../../helpers';
import { User, UserProjects } from '@infra/sequelize/projectionsNext';
import onUserRightsToProjectGranted from './onUserRightsToProjectGranted';

describe('userProjects.onUserRightsToProjectGranted', () => {
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  beforeAll(async () => {
    await resetDatabase();
    await User.create({ id: userId, email: 'utilisateur@email.com', role: 'porteur-projet' });
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

  describe(`Gestion des doublons`, () => {
    it(`Étant donné un utilisateur en doublon
        Lorsqu'un utilisateur est autorisé à accéder à un projet
        Alors chaque occurence de l'utilisateur devrait avoir les droits d'accès pour le projet`, async () => {
      const duplicatedUserId = new UniqueEntityID().toString();
      await User.create({
        id: duplicatedUserId,
        email: 'utilisateur@email.com',
        role: 'porteur-projet',
      });

      await onUserRightsToProjectGranted(
        new UserRightsToProjectGranted({
          payload: {
            projectId,
            userId,
            grantedBy: '',
          },
        }),
      );

      expect(
        await UserProjects.findOne({
          where: { userId },
          attributes: ['userId', 'projectId'],
          raw: true,
        }),
      ).toEqual({ userId, projectId });

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
