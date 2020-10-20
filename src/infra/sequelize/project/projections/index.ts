import { EventBus } from '../../../../modules/eventStore'
import {
  ProjectCertificateGenerated,
  ProjectCertificateUpdated,
  ProjectDataCorrected,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectNotificationDateSet,
  ProjectNotified,
} from '../../../../modules/project/events'
import { onProjectCertificate } from './onProjectCertificate'
import { onProjectDataCorrected } from './onProjectDataCorrected'
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet'
import { onProjectGFDueDateSet } from './onProjectGFDueDateSet'
import { onProjectNotificationDateSet } from './onProjectNotificationDateSet'

export const initProjectProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectDataCorrected.type, onProjectDataCorrected(models))
  eventBus.subscribe(ProjectDCRDueDateSet.type, onProjectDCRDueDateSet(models))
  eventBus.subscribe(ProjectGFDueDateSet.type, onProjectGFDueDateSet(models))
  eventBus.subscribe(ProjectNotified.type, onProjectNotificationDateSet(models))
  eventBus.subscribe(
    ProjectNotificationDateSet.type,
    onProjectNotificationDateSet(models)
  )
  eventBus.subscribe(
    ProjectCertificateGenerated.type,
    onProjectCertificate(models)
  )
  eventBus.subscribe(
    ProjectCertificateUpdated.type,
    onProjectCertificate(models)
  )

  console.log('Initialized Project projections')
}
