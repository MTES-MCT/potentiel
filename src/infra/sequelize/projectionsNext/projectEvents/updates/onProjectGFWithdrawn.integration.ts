import { ProjectEvent } from '..'
import { UniqueEntityID } from '@core/domain'
import { ProjectGFWithdrawn, ProjectGFWithdrawnPayload } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import onProjectGFWithdrawn from './onProjectGFWithdrawn'

describe('onProjectGFWithdrawn', () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  it('should create a new event of type ProjectGFWithdrawn', async () => {
    const projectId = new UniqueEntityID().toString()
    const removedBy = 'user-id'
    const occurredAt = new Date('2022-01-12')

    await onProjectGFWithdrawn(
      new ProjectGFWithdrawn({
        payload: { projectId, removedBy } as ProjectGFWithdrawnPayload,
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectGFWithdrawn',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
    })
  })
})
