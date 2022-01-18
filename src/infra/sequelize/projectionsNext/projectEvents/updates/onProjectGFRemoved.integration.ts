import { ProjectEvent } from '..'
import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFRemoved, ProjectGFRemovedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import onProjectGFRemoved from './onProjectGFRemoved'

describe('onProjectGFRemoved', () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  it('should create a new event of type ProjectGFRemoved', async () => {
    const projectId = new UniqueEntityID().toString()
    const removedBy = 'user-id'
    const occurredAt = new Date('2022-01-12')

    await onProjectGFRemoved(
      new ProjectGFRemoved({
        payload: { projectId, removedBy } as ProjectGFRemovedPayload,
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectGFRemoved',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
    })
  })
})
