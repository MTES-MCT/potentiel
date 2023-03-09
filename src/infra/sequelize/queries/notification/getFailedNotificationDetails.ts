import { wrapInfra } from '@core/utils';
import { makePaginatedList, paginate } from '../../../../helpers/paginate';
import { FailedNotificationDTO, GetFailedNotificationDetails } from '@modules/notification';
import { Notification } from '@infra/sequelize/projectionsNext';

export const getFailedNotificationDetails: GetFailedNotificationDetails = (pagination) => {
  return wrapInfra(
    Notification.findAndCountAll({
      where: { status: 'error' },
      order: [['createdAt', 'DESC']],
      ...paginate(pagination),
    }),
  ).map(({ count, rows }) =>
    makePaginatedList(
      rows
        .map((item) => item.get())
        .map(
          ({ id, message, type, createdAt, error }) =>
            ({
              id,
              recipient: {
                email: message.email,
                name: message.name || '',
              },
              type,
              createdAt: createdAt.getTime(),
              error,
            } as FailedNotificationDTO),
        ),
      count,
      pagination,
    ),
  );
};
