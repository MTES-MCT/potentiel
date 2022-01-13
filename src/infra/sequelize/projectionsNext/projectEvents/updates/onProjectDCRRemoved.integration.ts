import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRRemoved, ProjectDCRRemovedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import { onProjectDCRRemoved } from './onProjectDCRRemoved'

describe('onProjectDCRRemoved', () => {
  const projectId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const removedBy = 'user-id'

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectDCRRemoved', async () => {
    await onProjectDCRRemoved(
      new ProjectDCRRemoved({
        payload: {
          projectId,
          removedBy,
        } as ProjectDCRRemovedPayload,
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      projectId,
      type: 'ProjectDCRRemoved',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { removedBy },
    })
  })
})
