import { beforeAll, describe, expect, it } from '@jest/globals';
import { getFailedNotificationsForRetry } from './getFailedNotificationsForRetry';
import { resetDatabase } from '../../helpers';
import { UniqueEntityID } from '../../../../core/domain';
import { Notification } from "../../projectionsNext";

const fakeNotificationArgs = {
  message: {},
  context: {},
  variables: {},
  createdAt: new Date(),
  status: 'sent',
};

describe('Sequelize getFailedNotificationsForRetry', () => {
  describe('getFailedNotificationsForRetry()', () => {
    describe('in general', () => {
      const targetId = new UniqueEntityID();

      beforeAll(async () => {
        await resetDatabase();

        await Notification.create({
          ...fakeNotificationArgs,
          id: targetId.toString(),
          type: 'password-reset',
          status: 'error',
        });
        await Notification.create({
          ...fakeNotificationArgs,
          id: new UniqueEntityID().toString(),
          type: 'password-reset',
          status: 'sent',
        });
        await Notification.create({
          ...fakeNotificationArgs,
          id: new UniqueEntityID().toString(),
          type: 'password-reset',
          status: 'retried',
        });
        await Notification.create({
          ...fakeNotificationArgs,
          id: new UniqueEntityID().toString(),
          type: 'password-reset',
          status: 'cancelled',
        });
      });

      it('should return the notifications with status of error', async () => {
        const results = await getFailedNotificationsForRetry();

        expect(results._unsafeUnwrap()).toEqual([{ id: targetId, isObsolete: false }]);
      });
    });

    describe('when multiple password-reset for the same email', () => {
      const obsoleteId = new UniqueEntityID();
      const stillCurrentId = new UniqueEntityID();
      const otherId = new UniqueEntityID();

      beforeAll(async () => {
        await resetDatabase();
        await Notification.create({
          ...fakeNotificationArgs,
          id: obsoleteId.toString(),
          type: 'password-reset',
          message: { email: 'target@test.test' },
          createdAt: new Date(1),
          status: 'error',
        });
        await Notification.create({
          ...fakeNotificationArgs,
          id: stillCurrentId.toString(),
          type: 'password-reset',
          message: { email: 'target@test.test' },
          createdAt: new Date(2),
          status: 'error',
        });
        await Notification.create({
          ...fakeNotificationArgs,
          id: otherId.toString(),
          type: 'password-reset',
          message: { email: 'other@test.test' },
          createdAt: new Date(3),
          status: 'error',
        });
      });

      it('should mark all but latest obsolete', async () => {
        const results = await getFailedNotificationsForRetry();

        expect(results._unsafeUnwrap()).toEqual([
          { id: otherId, isObsolete: false },
          { id: stillCurrentId, isObsolete: false },
          { id: obsoleteId, isObsolete: true },
        ]);
      });
    });
  });
});
