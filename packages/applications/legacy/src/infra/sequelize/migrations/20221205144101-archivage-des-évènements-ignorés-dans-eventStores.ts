import { Op } from 'sequelize';
import models from '../models';

export default {
  up: () => {
    const { EventStore } = models;
    return EventStore.destroy({
      where: {
        type: {
          [Op.in]: [
            'ProjectNewRulesOptedIn',
            'NouveauCahierDesChargesChoisi',
            'ProjectGFInvalidated',
          ],
        },
      },
    });
  },

  down: () => {},
};
