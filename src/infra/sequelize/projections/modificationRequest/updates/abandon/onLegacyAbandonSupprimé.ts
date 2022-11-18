import { logger } from '@core/utils'
import { LegacyAbandonSupprimé } from '@modules/project'

export const onLegacyAbandonSupprimé =
  (models) =>
  async ({ payload }: LegacyAbandonSupprimé) => {
    const { projetId } = payload
    try {
      await models.ModificationRequest.destroy({ where: { projectId: projetId, type: 'abandon' } })
    } catch (e) {
      logger.error(e)
    }
  }
