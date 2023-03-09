import { getFailedNotificationDetails } from './getFailedNotificationDetails';
import { resetDatabase } from '../../helpers';
import { UniqueEntityID } from '@core/domain';
import { Notification } from '@infra/sequelize/projectionsNext';

const fakeNotificationArgs = {
  message: {
    email: 'email@test.test',
    name: 'testname',
    subject: 'testsubject',
  },
  type: 'password-reset',
  context: {
    passwordRetrievalId: 'passwordRetrievalId',
    userId: 'userId',
  },
  variables: {
    password_reset_link: 'resetLink',
  },
  createdAt: new Date(123),
  status: 'sent',
};

describe('Sequelize getFailedNotificationDetails', () => {
  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();
  });

  describe('getFailedNotificationDetails()', () => {
    const targetId = new UniqueEntityID().toString();

    beforeAll(async () => {
      await Notification.create({
        ...fakeNotificationArgs,
        id: targetId,
        createdAt: new Date(456),
        status: 'error',
        error: 'errorMessage',
      });
      await Notification.create({
        ...fakeNotificationArgs,
        id: new UniqueEntityID().toString(),
        status: 'sent',
      });
      await Notification.create({
        ...fakeNotificationArgs,
        id: new UniqueEntityID().toString(),
        status: 'retried',
      });
    });

    it('should return the details of the notifications with status of error', async () => {
      const pagination = {
        page: 0,
        pageSize: 50,
      };

      const { items, itemCount } = (await getFailedNotificationDetails(pagination))._unsafeUnwrap();

      expect(itemCount).toEqual(1);
      expect(items).toEqual([
        {
          id: targetId,
          recipient: {
            email: 'email@test.test',
            name: 'testname',
          },
          type: 'password-reset',
          createdAt: 456,
          error: 'errorMessage',
        },
      ]);
    });
  });
});
