import { EventBus } from '@core/domain'
import { logger } from '@core/utils'
import { Projections } from '@infra/sequelize/models'
import { DatesMiseEnServiceImportées } from '@modules/project'

import { onDatesMiseEnServiceImportées } from './onDatesMiseEnServiceImportées'

export const initTacheDeFondProjections = (eventBus: EventBus, models: Projections) => {
  eventBus.subscribe(DatesMiseEnServiceImportées.type, onDatesMiseEnServiceImportées(models))

  logger.info('Initialized TacheDeFond projections')
}
