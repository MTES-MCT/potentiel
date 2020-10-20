import { EventBus } from '../../../../modules/eventStore'
import {
  ProjectCertificateGenerated,
  ProjectDataCorrected,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectNotified,
} from '../../../../modules/project/events'
import { onProjectCertificateGenerated } from './onProjectCertificateGenerated'
import { onProjectDataCorrected } from './onProjectDataCorrected'
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet'
import { onProjectGFDueDateSet } from './onProjectGFDueDateSet'
import { onProjectNotified } from './onProjectNotified'

export const initProjectProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectDataCorrected.type, onProjectDataCorrected(models))
  eventBus.subscribe(ProjectNotified.type, onProjectNotified(models))
  eventBus.subscribe(ProjectDCRDueDateSet.type, onProjectDCRDueDateSet(models))
  eventBus.subscribe(ProjectGFDueDateSet.type, onProjectGFDueDateSet(models))
  eventBus.subscribe(
    ProjectCertificateGenerated.type,
    onProjectCertificateGenerated(models)
  )

  console.log('Initialized Project projections')
}
