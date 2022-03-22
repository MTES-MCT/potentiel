import { UniqueEntityID } from '@core/domain'
import { ProjectDCRDueDateCancelled, ProjectDCRDueDateSet } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectDCRDueDateCancelled from './onProjectDCRDueDateCancelled'

describe('onProjectDCRDueDateCancelled', () => {
  const projectId = new UniqueEntityID().toString()
  const occurredAt = new Date('2021-11-27')
  const eventId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
    await ProjectEvent.create({
      projectId,
      type: ProjectDCRDueDateSet.type,
      eventPublishedAt: occurredAt.getTime(),
      id: eventId,
    })
  })

  it('should create a new project event of type ProjectDCRDueDateCancelled', async () => {
    await onProjectDCRDueDateCancelled(
      new ProjectDCRDueDateCancelled({
        payload: {
          projectId,
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({
      where: { projectId, type: ProjectDCRDueDateSet.type },
    })

    expect(projectEvent).toBeNull()
  })
})
