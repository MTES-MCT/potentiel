import { MakeEventStoreDeps, okAsync, wrapInfra } from '../../../core/utils'
import { sequelizeInstance } from '../../../sequelize.config'
import { toPersistance } from '../helpers'
import models from '../models'
const { EventStore } = models

export const rollbackEventsFromStore: MakeEventStoreDeps['rollbackEventsFromStore'] = (events) => {
  const rollbackEvents = async () => {
    const transaction = await sequelizeInstance.transaction()
    try {
      for (const event of events) {
        await EventStore.destroy({ where: { id: event.payload.eventId } }, { transaction })
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  return wrapInfra(rollbackEvents()).map(() => null)
}
