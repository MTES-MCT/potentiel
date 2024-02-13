import { describe, expect, it, jest } from '@jest/globals';
import { NotificationArgs } from '..';
import { UniqueEntityID } from '../../../core/domain';
import { makeProject } from '../../../entities';
import { None } from '../../../types';
import makeFakeProject from '../../../__tests__/fixtures/project';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { ProjectGFUploaded } from '../../project/events';
import { handleProjectGFUploaded } from './handleProjectGFUploaded';

const userId = new UniqueEntityID().toString();

describe('notification.handleProjectGFUploaded', () => {
  it(`Lorsque des garanties financières sont enregistrées
      Alors une notification devrait être envoyée aux utilisateurs Dreal de ou des régions du projet`, async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null);
    const findProjectById = jest.fn(async (region: string) =>
      makeProject(
        makeFakeProject({
          nomProjet: 'nomProjet',
          regionProjet: 'regionA / regionB',
          departementProjet: 'departement',
        }),
      ).unwrap(),
    );
    const findUserById = jest.fn(async (userId: string) => None);
    const findUsersForDreal = jest.fn(async (region: string) =>
      region === 'regionA'
        ? [makeFakeUser({ email: 'drealA@test.test', fullName: 'drealA' })]
        : [makeFakeUser({ email: 'drealB@test.test', fullName: 'drealB' })],
    );

    await handleProjectGFUploaded({
      sendNotification,
      findUserById,
      findUsersForDreal,
      findProjectById,
    })(
      new ProjectGFUploaded({
        payload: {
          projectId: 'projectId',
          gfDate: new Date(),
          fileId: '',
          submittedBy: userId,
        },
      }),
    );

    expect(findUsersForDreal).toHaveBeenCalledTimes(2);
    expect(findUsersForDreal).toHaveBeenCalledWith('regionA');
    expect(findUsersForDreal).toHaveBeenCalledWith('regionB');

    expect(sendNotification).toHaveBeenCalledTimes(2);
    const notifications = sendNotification.mock.calls.map((call) => call[0]);
    expect(
      notifications.some(
        (notification) =>
          notification.type === 'dreal-gf-enregistrée-notification' &&
          notification.message.email === 'drealA@test.test' &&
          notification.message.name === 'drealA' &&
          notification.variables.departementProjet === 'departement' &&
          notification.variables.nomProjet === 'nomProjet',
      ),
    ).toBe(true);
    expect(
      notifications.some(
        (notification) =>
          notification.type === 'dreal-gf-enregistrée-notification' &&
          notification.message.email === 'drealB@test.test' &&
          notification.message.name === 'drealB' &&
          notification.variables.departementProjet === 'departement' &&
          notification.variables.nomProjet === 'nomProjet',
      ),
    ).toBe(true);
  });
});
