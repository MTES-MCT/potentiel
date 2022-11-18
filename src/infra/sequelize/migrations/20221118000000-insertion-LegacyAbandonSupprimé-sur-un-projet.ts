import { QueryInterface } from 'sequelize'
import { ProjectEvent } from '../projectionsNext'
import { toPersistance } from '../helpers'
import models from '../models'
import { LegacyAbandonSupprimé } from '@modules/project'

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { Project, ModificationRequest, EventStore } = models

      const projectId = 'd0d30f0f-5b6a-46d9-af7e-d113bd715504'

      const garantiesFinancieresDueOn = 1570226400000
      const dcrDueOn = 1570226400000
      const completionDueOn = 1628028000000
      const abandonedOn = 0

      await ModificationRequest.destroy({
        where: { projectId, type: 'abandon' },
        transaction,
      })

      await Project.update(
        { abandonedOn, garantiesFinancieresDueOn, dcrDueOn, completionDueOn },
        { where: { id: projectId }, transaction }
      )

      await ProjectEvent.destroy({
        where: { projectId, 'payload.modificationType': 'abandon' },
        transaction,
      })

      await EventStore.create(
        toPersistance(
          new LegacyAbandonSupprimé({
            payload: { garantiesFinancieresDueOn, dcrDueOn, completionDueOn, projetId: projectId },
          })
        ),
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async () => {},
}
