import { ProjectEvent } from '@infra/sequelize'
import { Op } from 'sequelize'

export default {
  up: () => {
    return ProjectEvent.destroy({
      where: {
        type: {
          [Op.in]: [
            'ProjectNewRulesOptedIn',
            'NouveauCahierDesChargesChoisi',
            'ProjectGFInvalidated',
          ],
        },
      },
    })
  },

  down: () => {},
}
