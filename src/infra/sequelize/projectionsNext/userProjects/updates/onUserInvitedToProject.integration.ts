import { UniqueEntityID } from '@core/domain';
import { UserInvitedToProject } from '@modules/authZ';
import { resetDatabase } from '../../../helpers';
import { UserProjects } from '@infra/sequelize/projectionsNext';
import onUserInvitedToProject from './onUserInvitedToProject';

describe('Inviter un utilisateur sur un projet', () => {
  const projectId1 = new UniqueEntityID().toString();
  const projectId2 = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
  });

  it(`Étant donné un utilisateur invité sur un projet dont il a déjà accès
      Lorsqu'on invite l'utilisateur sur ce même projet
      Alors l'utilisateur ne devrait pas être invité à nouveau`, async () => {
    await UserProjects.create({
      userId,
      projectId: projectId1,
    });

    await onUserInvitedToProject(
      new UserInvitedToProject({
        payload: {
          projectIds: [projectId1],
          userId,
          invitedBy: 'DEV',
        },
      }),
    );

    expect(await UserProjects.count({ where: { userId, projectId: projectId1 } })).toEqual(1);
  });

  it(`Étant donné un utilisateur invité sur plusieurs projets dont il n'a pas actuellement pas accès
      Lorsqu'on invite l'utilisateur sur ces 
      Alors l'utilisateur devrait être invité pour chacun d'entre eux`, async () => {
    await onUserInvitedToProject(
      new UserInvitedToProject({
        payload: {
          projectIds: [projectId1, projectId2],
          userId,
          invitedBy: 'DEV',
        },
      }),
    );

    expect(await UserProjects.count({ where: { userId, projectId: projectId1 } })).toEqual(1);
    expect(await UserProjects.count({ where: { userId, projectId: projectId2 } })).toEqual(1);
  });
});
