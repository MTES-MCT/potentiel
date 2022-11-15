import models from '../models'
import { ModificationRequestCancelled } from '@modules/modificationRequest'
import { toPersistance } from '../helpers'
import { UniqueEntityID } from '@core/domain'

export default {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { ProjectEvent, EventStore } = models
      const modificationRequestId = 'edbdb54d-8442-4d8f-9f8c-540cbc3dc2a6'
      const projectId = 'ea5a9db1-a026-11ea-b05c-11293d839ea9'

      await ProjectEvent.create(
        {
          projectId,
          type: ModificationRequestCancelled.type,
          eventPublishedAt: new Date().getTime(),
          valueDate: new Date().getTime(),
          id: new UniqueEntityID().toString(),
          payload: { modificationRequestId },
        },
        { transaction }
      )

      await EventStore.create(
        toPersistance(
          new ModificationRequestCancelled({
            payload: { modificationRequestId, cancelledBy: '' },
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

  down: async () => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
