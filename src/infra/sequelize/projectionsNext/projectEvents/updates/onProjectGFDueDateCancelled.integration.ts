import { UniqueEntityID } from '@core/domain'
import { ProjectGFDueDateCancelled, ProjectGFDueDateSet } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectGFDueDateCancelled from './onProjectGFDueDateCancelled'

describe('onProjectGFDueDateCancelled', () => {
  const projectId = new UniqueEntityID().toString()
  const occurredAt = new Date('2021-11-27')
  const eventId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
    await ProjectEvent.create({
      projectId,
      type: ProjectGFDueDateSet.type,
      eventPublishedAt: occurredAt.getTime(),
      id: eventId,
      valueDate: occurredAt.getTime(),
    })
  })

  it('should remove the ProjectGFDueDateSet event for this project', async () => {
    await onProjectGFDueDateCancelled(
      new ProjectGFDueDateCancelled({
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
      where: { projectId, type: ProjectGFDueDateSet.type },
    })

    expect(projectEvent).toBeNull()
  })
})
