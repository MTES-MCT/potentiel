import { logger } from '../../../../../core/utils'
import { EventBus } from '../../../../../modules/eventStore'
import {
  ProjectDCRRemoved,
  ProjectDCRSubmitted,
  ProjectGFRemoved,
  ProjectStepStatusUpdated,
  ProjectGFSubmitted,
  ProjectPTFRemoved,
  ProjectPTFSubmitted,
  ProjectClaimed,
  ProjectClaimFailed,
  ProjectClaimedByOwner,
} from '../../../../../modules/project/events'
import { onProjectStepSubmitted } from './onProjectStepSubmitted'
import { onProjectStepRemoved } from './onProjectStepRemoved'
import { onProjectStepStatusUpdated } from './onProjectStepStatusUpdated'
import { onProjectClaimed } from './onProjectClaimed'
import { onProjectClaimFailed } from './onProjectClaimFailed'

export const initProjectPTFProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectPTFSubmitted.type, onProjectStepSubmitted(models))
  eventBus.subscribe(ProjectDCRSubmitted.type, onProjectStepSubmitted(models))
  eventBus.subscribe(ProjectGFSubmitted.type, onProjectStepSubmitted(models))
  eventBus.subscribe(ProjectClaimed.type, onProjectClaimed(models, userRepos))
  eventBus.subscribe(ProjectClaimedByOwner.type, onProjectClaimed(models, userRepos))
  eventBus.subscribe(ProjectClaimFailed.type, onProjectClaimFailed(models))
  eventBus.subscribe(ProjectStepStatusUpdated.type, onProjectStepStatusUpdated(models))

  eventBus.subscribe(ProjectPTFRemoved.type, onProjectStepRemoved(models))
  eventBus.subscribe(ProjectDCRRemoved.type, onProjectStepRemoved(models))
  eventBus.subscribe(ProjectGFRemoved.type, onProjectStepRemoved(models))

  logger.info('Initialized Project PTF projections')
}
