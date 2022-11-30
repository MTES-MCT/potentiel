import { logger } from '@core/utils'
import {
  ProjectGFRemoved,
  ProjectGFSubmitted,
  ProjectPTFRemoved,
  ProjectPTFSubmitted,
  GarantiesFinancièresValidées,
  GarantiesFinancièresInvalidées,
} from '@modules/project'
import { onProjectStepSubmitted } from './onProjectStepSubmitted'
import { onProjectStepRemoved } from './onProjectStepRemoved'
import { EventBus } from '@core/domain'
import { onGarantiesFinancièresValidées } from './onGarantiesFinancièresValidées'
import { onGarantiesFinancièresInvalidées } from './onGarantiesFinancièresInvalidées'

export const initProjectPTFProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectPTFSubmitted.type, onProjectStepSubmitted(models))
  eventBus.subscribe(ProjectGFSubmitted.type, onProjectStepSubmitted(models))

  eventBus.subscribe(GarantiesFinancièresValidées.type, onGarantiesFinancièresValidées(models))
  eventBus.subscribe(GarantiesFinancièresInvalidées.type, onGarantiesFinancièresInvalidées(models))

  eventBus.subscribe(ProjectPTFRemoved.type, onProjectStepRemoved(models))
  eventBus.subscribe(ProjectGFRemoved.type, onProjectStepRemoved(models))

  logger.info('Initialized Project PTF projections')
}
