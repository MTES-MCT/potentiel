import { beforeAll, describe, expect, it } from '@jest/globals';
import { NotificationRepo } from './notificationRepo';
import { Notification } from '../../../modules/notification';
import { resetDatabase } from '../helpers';
import { UniqueEntityID } from '../../../core/domain';
import { logger } from '../../../core/utils';
import { Notification as NotificationModel } from "../projectionsNext";

describe('Sequelize NotificationRepo', () => {
  const notificationRepo = new NotificationRepo();

  beforeAll(async () => {
    await resetDatabase();
  });

  describe('save(notification)', () => {
    let notification: Notification;

    beforeAll(() => {
      const notificationResult = Notification.create({
        message: {
          email: 'email@test.test',
          name: 'testname',
          subject: 'testsubject',
        },
        type: 'designation',
        context: {
          appelOffreId: 'appelOffreId',
          periodeId: 'periodeId',
        },
        variables: {
          invitation_link: 'invitation_link',
        },
      });

      expect(notificationResult.isOk()).toBe(true);
      if (notificationResult.isErr()) return;

      notification = notificationResult.value;
    });

    it('should save the Notification to database', async () => {
      const saveResult = await notificationRepo.save(notification);

      if (saveResult.isErr()) logger.error(saveResult.error);
      expect(saveResult.isOk()).toBe(true);

      const retrievedNotification = await NotificationModel.findByPk(notification.id.toString());

      expect(retrievedNotification).toBeDefined();
      expect(retrievedNotification?.type).toEqual('designation');
    });
  });

  describe('load(notificationId)', () => {
    describe('when the Notification exists', () => {
      const notificationId = new UniqueEntityID();

      beforeAll(async () => {
        await NotificationModel.create({
          id: notificationId.toString(),
          message: {
            email: 'email@test.test',
            name: 'testname',
            subject: 'testsubject',
          },
          type: 'designation',
          context: {
            appelOffreId: 'appelOffreId',
            periodeId: 'periodeId',
          },
          variables: {
            invitation_link: 'invitation_link',
          },
          createdAt: new Date(),
          status: 'sent',
        });
      });

      it('should return a Notification', async () => {
        const notificationResult = await notificationRepo.load(notificationId);
        expect(notificationResult.isOk()).toBe(true);

        if (notificationResult.isErr()) return;

        const notification = notificationResult.value;

        expect(notification).toBeInstanceOf(Notification);
        expect(notification.message.email).toEqual('email@test.test');
      });
    });
  });
});
