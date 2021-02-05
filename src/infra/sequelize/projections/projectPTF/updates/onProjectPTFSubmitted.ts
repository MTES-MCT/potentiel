import { logger } from '../../../../../core/utils'
import { ProjectPTFSubmitted } from '../../../../../modules/project/events'

export const onProjectPTFSubmitted = (models) => async (event: ProjectPTFSubmitted) => {
  const { ProjectPTF } = models

  const { projectId, ptfDate, fileId, submittedBy } = event.payload
  try {
    await ProjectPTF.create({
      projectId,
      ptfDate,
      fileId,
      submittedBy,
    })
  } catch (e) {
    logger.error(e)
  }
}
