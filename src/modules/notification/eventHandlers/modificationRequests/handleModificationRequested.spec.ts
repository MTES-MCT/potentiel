import { okAsync } from 'neverthrow';
import { NotificationArgs } from '../..';
import { UniqueEntityID } from '@core/domain';
import { makeProject } from '@entities';
import routes from '@routes';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { ModificationRequested } from '../../../modificationRequest';
import { GetInfoForModificationRequested } from '../../queries';
import { handleModificationRequested } from './handleModificationRequested';

const modificationRequestId = new UniqueEntityID().toString();
const userId = new UniqueEntityID().toString();
const projectId = new UniqueEntityID().toString();

describe('notification.handleModificationRequested', () => {
  const getInfoForModificationRequested = jest.fn((args: { projectId; userId }) =>
    okAsync({
      porteurProjet: { email: 'email@test.test', fullName: 'john doe' },
      nomProjet: 'nomProjet',
    }),
  ) as GetInfoForModificationRequested;

  const sendNotification = jest.fn(async (args: NotificationArgs) => null);
  const findProjectById = jest.fn();
  const findUsersForDreal = jest.fn();

  it(`Etant donné un projet ayant plusieurs porteurs rattachés
      Lorsque l'un des porteurs dépose une demande
      Alors tous les porteurs ayant accès au projet devraient être notifiés`, async () => {
    sendNotification.mockClear();

    await handleModificationRequested({
      sendNotification,
      getInfoForModificationRequested,
      findUsersForDreal,
      findProjectById,
    })(
      new ModificationRequested({
        payload: {
          type: 'recours',
          modificationRequestId,
          projectId,
          requestedBy: userId,
          authority: 'dgec',
        },
      }),
    );

    expect(getInfoForModificationRequested).toHaveBeenCalledWith({ projectId, userId });

    expect(sendNotification).toHaveBeenCalledTimes(1);
    const notifications = sendNotification.mock.calls.map((call) => call[0]);
    expect(
      notifications.every(
        (notification) =>
          notification.type === 'modification-request-status-update' &&
          notification.message.email === 'email@test.test' &&
          notification.message.name === 'john doe' &&
          notification.variables.status === 'envoyée' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'recours' &&
          notification.variables.document_absent === '',
      ),
    ).toBe(true);
  });

  it(`Etant donné un projet sous l'autorité de deux régions 
      Et plusieurs agent rattachés à la DREAL chaque région 
      Quand une demande est envoyée
      Alors tous les agents des deux régions du projet devraient être notifiés`, async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null);
    const findProjectById = jest.fn(async (region: string) =>
      makeProject(
        makeFakeProject({
          id: projectId,
          nomProjet: 'nomProjet',
          regionProjet: 'regionA / regionB',
          departementProjet: 'departement',
        }),
      ).unwrap(),
    );
    const findUsersForDreal = jest.fn(async (region: string) =>
      region === 'regionA'
        ? [makeFakeUser({ email: 'drealA@test.test', fullName: 'drealA' })]
        : [makeFakeUser({ email: 'drealB@test.test', fullName: 'drealB' })],
    );

    await handleModificationRequested({
      sendNotification,
      findProjectById,
      getInfoForModificationRequested,
      findUsersForDreal,
    })(
      new ModificationRequested({
        payload: {
          type: 'puissance',
          modificationRequestId,
          projectId,
          requestedBy: userId,
          puissance: 18,
          justification: 'justification',
          authority: 'dreal',
        },
      }),
    );

    expect(findUsersForDreal).toHaveBeenCalledTimes(2);
    expect(findUsersForDreal).toHaveBeenCalledWith('regionA');
    expect(findUsersForDreal).toHaveBeenCalledWith('regionB');

    expect(sendNotification).toHaveBeenCalledTimes(3);
    const notifications = sendNotification.mock.calls.map((call) => call[0]);

    expect(
      notifications.some(
        (notification) =>
          notification.type === 'admin-modification-requested' &&
          notification.message.email === 'drealA@test.test' &&
          notification.message.name === 'drealA' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'puissance' &&
          notification.variables.modification_request_url ===
            routes.DEMANDE_PAGE_DETAILS(modificationRequestId) &&
          notification.variables.departement_projet === 'departement' &&
          notification.context.modificationRequestId === modificationRequestId &&
          notification.context.dreal === 'regionA' &&
          notification.context.projectId === projectId,
      ),
    ).toBe(true);
    expect(
      notifications.some(
        (notification) =>
          notification.type === 'admin-modification-requested' &&
          notification.message.email === 'drealB@test.test' &&
          notification.message.name === 'drealB' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'puissance' &&
          notification.variables.modification_request_url ===
            routes.DEMANDE_PAGE_DETAILS(modificationRequestId) &&
          notification.variables.departement_projet === 'departement' &&
          notification.context.modificationRequestId === modificationRequestId &&
          notification.context.dreal === 'regionB' &&
          notification.context.projectId === projectId,
      ),
    ).toBe(true);
  });
});
