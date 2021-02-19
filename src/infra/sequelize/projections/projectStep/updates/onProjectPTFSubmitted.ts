import { UniqueEntityID } from '../../../../../core/domain'
import { logger } from '../../../../../core/utils'
import { ProjectPTFSubmitted } from '../../../../../modules/project/events'

export const onProjectPTFSubmitted = (models) => async (event: ProjectPTFSubmitted) => {
  const { ProjectStep } = models

  const { projectId, ptfDate, fileId, submittedBy } = event.payload
  try {
    await ProjectStep.create({
      id: new UniqueEntityID().toString(),
      type: 'ptf',
      projectId,
      stepDate: ptfDate,
      fileId,
      submittedBy,
      submittedOn: event.occurredAt,
    })
  } catch (e) {
    logger.error(e)
  }
}
