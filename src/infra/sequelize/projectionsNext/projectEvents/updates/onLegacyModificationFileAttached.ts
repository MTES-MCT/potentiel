import { LegacyModificationFileAttached } from '@modules/modificationRequest'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  LegacyModificationFileAttached,
  async ({ payload, occurredAt, id }, transaction) => {
    const { projectId, fileId, filename } = payload

    await ProjectEvent.create(
      {
        projectId,
        type: 'LegacyModificationFileAttached',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id,
        payload: {
          fileId,
          filename,
        },
      },
      { transaction }
    )
  }
)
