import { okAsync } from 'neverthrow';
import { NotificationArgs } from '../..';
import { UniqueEntityID } from '@core/domain';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationRequestCancelled,
} from '../../../modificationRequest';
import { handleModificationRequestCancelled } from './handleModificationRequestCancelled';

const modificationRequestId = new UniqueEntityID().toString();
const dgecEmail = 'dgec@test.test';

describe('notification.handleModificationRequestCancelled', () => {
  it(`Etant donné une demande de modification sous l'autorité DGEC
      Lorsque le porteur annule la demande
      Alors une notification par email devrait être envoyée au mail générique de la DGEC`, async () => {
    const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
      jest.fn(() =>
        okAsync({
          porteursProjet: [],
          departementProjet: 'departement',
          regionProjet: '',
          nomProjet: 'nomProjet',
          type: 'recours',
          autorité: 'dgec',
          appelOffreId: 'Sol',
          périodeId: '1',
        }),
      );

    const sendNotification = jest.fn(async (args: NotificationArgs) => null);

    const findUsersForDreal = jest.fn(async () => []);

    await handleModificationRequestCancelled({
      sendNotification,
      findUsersForDreal,
      dgecEmail,
      getModificationRequestInfoForStatusNotification,
    })(
      new ModificationRequestCancelled({
        payload: {
          modificationRequestId,
          cancelledBy: '',
        },
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(1);
    const notification = sendNotification.mock.calls[0][0];
    expect(notification).toMatchObject({
      type: 'modification-request-cancelled',
      message: {
        email: dgecEmail,
        name: 'DGEC',
        subject: `Annulation d'une demande de type recours pour un projet Sol 1`,
      },
      context: {
        modificationRequestId,
      },
      variables: {
        nom_projet: 'nomProjet',
        type_demande: 'recours',
        departement_projet: 'departement',
      },
    });
  });

  it(`Etant donné une demande de modification sous l'autorité DREAL
      Lorsque le porteur annule la demande
      Alors une notification par email devrait être envoyée à tous les agents DREAL concernés par le projet`, async () => {
    const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
      jest.fn(() =>
        okAsync({
          porteursProjet: [],
          departementProjet: 'departement',
          regionProjet: 'regionA / regionB',
          nomProjet: 'nomProjet',
          type: 'recours',
          autorité: 'dreal',
          appelOffreId: 'Sol',
          périodeId: '1',
        }),
      );

    const sendNotification = jest.fn(async (args: NotificationArgs) => null);

    const findUsersForDreal = jest.fn(async (region: string) =>
      region === 'regionA'
        ? [makeFakeUser({ email: 'drealA@test.test', fullName: 'drealA' })]
        : [makeFakeUser({ email: 'drealB@test.test', fullName: 'drealB' })],
    );

    await handleModificationRequestCancelled({
      sendNotification,
      findUsersForDreal,
      dgecEmail,
      getModificationRequestInfoForStatusNotification,
    })(
      new ModificationRequestCancelled({
        payload: {
          modificationRequestId,
          cancelledBy: '',
        },
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(2);
    const notifications = sendNotification.mock.calls.map((call) => call[0]);
    expect(
      notifications.some(
        (notification) =>
          notification.type === 'modification-request-cancelled' &&
          notification.message.email === 'drealA@test.test' &&
          notification.message.name === 'drealA' &&
          notification.variables.departement_projet === 'departement' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'recours',
      ),
    ).toBe(true);
    expect(
      notifications.some(
        (notification) =>
          notification.type === 'modification-request-cancelled' &&
          notification.message.email === 'drealB@test.test' &&
          notification.message.name === 'drealB' &&
          notification.variables.departement_projet === 'departement' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'recours',
      ),
    ).toBe(true);
  });
});
