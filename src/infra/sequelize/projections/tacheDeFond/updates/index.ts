import { EventBus } from '@core/domain'
import { logger } from '@core/utils'
import { Projections } from '@infra/sequelize/models'
import { ImportDatesDeMiseEnServiceDémarré } from '@modules/project'

import { onImportDatesDeMiseEnServiceDémarré } from './onImportDatesDeMiseEnServiceDémarré'

export const initTacheDeFondProjections = (eventBus: EventBus, models: Projections) => {
  eventBus.subscribe(
    ImportDatesDeMiseEnServiceDémarré.type,
    onImportDatesDeMiseEnServiceDémarré(models)
  )

  logger.info('Initialized TacheDeFond projections')
}
