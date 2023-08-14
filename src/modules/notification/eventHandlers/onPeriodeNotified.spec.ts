import { describe, expect, it, jest } from '@jest/globals';
import { NotificationArgs } from '../Notification';
import { makeOnPeriodeNotified } from './onPeriodeNotified';
import { PeriodeNotified } from "../../project";

describe('notification.handleLegacyCandidateNotified', () => {
  it('should send a notification email to the PP', async () => {
    const notifiedOn = new Date().getTime();
    const periodeId = '1';
    const appelOffreId = 'Eolien';
    const users = [
      { id: 'id1', email: 'email1@test.test', fullName: 'user1' },
      { id: 'id2', email: 'email2@test.test', fullName: 'user2' },
      { id: 'id3', email: 'email3@test.test', fullName: 'user3' },
      { id: 'id4', email: 'email4@test.test', fullName: 'user4' },
    ];

    const sendNotification = jest.fn(async (args: NotificationArgs) => null);

    const getRecipientsForPeriodeNotifiedNotification = () => Promise.resolve(users);

    const onPeriodeNotified = makeOnPeriodeNotified({
      sendNotification,
      getRecipientsForPeriodeNotifiedNotification,
    });

    await onPeriodeNotified(
      new PeriodeNotified({
        payload: { appelOffreId, periodeId, notifiedOn, requestedBy: 'id' },
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(users.length);

    for (const { email, id, fullName: name } of users) {
      expect(sendNotification).toHaveBeenCalledWith({
        type: 'tous-rôles-sauf-dgec-et-porteurs-nouvelle-periode-notifiée',
        message: {
          email,
          name,
          subject: `Potentiel - Notification de la période ${periodeId} de l'appel d'offres ${appelOffreId}`,
        },
        context: { userId: id },
        variables: {
          appel_offre: appelOffreId,
          periode: periodeId,
          date_notification: new Date(notifiedOn).toLocaleDateString(),
        },
      });
    }
  });
});
