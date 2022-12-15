import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectPTFSubmitted } from '@modules/project'

export const onProjectStepSubmitted = (models) => async (event: ProjectPTFSubmitted) => {
  const { ProjectStep } = models

  const { projectId, fileId, submittedBy } = event.payload

  try {
    await ProjectStep.create({
      id: new UniqueEntityID().toString(),
      type: 'ptf',
      projectId,
      stepDate: event.payload.ptfDate,
      fileId,
      submittedBy,
      submittedOn: event.occurredAt,
      status: 'à traiter',
    })
  } catch (e) {
    logger.error(e)
  }
}
