import { logger } from '../../../../core/utils';
import { User } from '../../projectionsNext';
import { GetRecipientsForPeriodeNotifiedNotification } from '../../../../modules/notification';
import { Op } from 'sequelize';

export const getRecipientsForPeriodeNotifiedNotification: GetRecipientsForPeriodeNotifiedNotification =
  () => {
    try {
      return User.findAll({
        where: { role: { [Op.notIn]: ['admin', 'dgec-validateur', 'porteur-projet'] } },
      }).then((users) => users.map(({ email, fullName, id }) => ({ email, fullName, id })));
    } catch (error) {
      logger.error(error);
    }
  };
