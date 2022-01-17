import { EventBus } from '@core/domain'
import { logger } from '@core/utils'
import { PeriodeCreated, PeriodeUpdated } from '@modules/appelOffre'
import { onPeriodeCreated } from './onPeriodeCreated'
import { onPeriodeUpdated } from './onPeriodeUpdated'
export * from './onAppelOffreCreated'
export * from './onAppelOffreUpdated'
export * from './onAppelOffreRemoved'

export const initAppelOffreProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(PeriodeCreated.type, onPeriodeCreated(models))
  eventBus.subscribe(PeriodeUpdated.type, onPeriodeUpdated(models))

  logger.info('Initialized AppelOffre projections')
}
