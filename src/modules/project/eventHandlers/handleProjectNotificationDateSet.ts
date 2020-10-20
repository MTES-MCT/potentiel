import moment from 'moment'
import { ProjectRepo } from '../../../dataAccess'
import { GetFamille } from '../../appelOffre'
import { EventBus } from '../../eventStore'
import {
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectNotificationDateSet,
  ProjectNotified,
} from '../events'

export const handleProjectNotificationDateSet = (deps: {
  eventBus: EventBus
  findProjectById: ProjectRepo['findById']
  getFamille: GetFamille
}) => async (event: ProjectNotificationDateSet | ProjectNotified) => {
  // console.log('handleProjectNotificationDateSet', event)
  const { payload, requestId, aggregateId } = event
  const { projectId, notifiedOn } = payload

  if (!aggregateId) {
    console.log(
      'handleProjectNotificationDateSet event missing aggregateId',
      event
    )
    return
  }

  const project = await deps.findProjectById(payload.projectId)

  if (!project) {
    console.log('handleProjectNotificationDateSet cannot find project', event)
    return
  }

  if (project.classe !== 'Classé') return // Nothing to do

  // Set the DCR Due Date
  await deps.eventBus.publish(
    new ProjectDCRDueDateSet({
      payload: {
        projectId,
        dcrDueOn: moment(notifiedOn).add(2, 'months').toDate().getTime(),
      },
      requestId,
    })
  )

  // Set the GF Due Date if required by project family
  const familleResult = await deps.getFamille(
    project.appelOffreId,
    project.familleId
  )
  if (
    familleResult &&
    familleResult.isOk() &&
    (!!familleResult.value.garantieFinanciereEnMois ||
      familleResult.value.soumisAuxGarantiesFinancieres)
  ) {
    await deps.eventBus.publish(
      new ProjectGFDueDateSet({
        payload: {
          projectId,
          garantiesFinancieresDueOn: moment(notifiedOn)
            .add(2, 'months')
            .toDate()
            .getTime(),
        },
        requestId,
      })
    )
  }
}
