import { UniqueEntityID } from '@core/domain'
import { ProjectCompletionDueDateCancelled, ProjectCompletionDueDateSet } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectCompletionDueDateCancelled from './onProjectCompletionDueDateCancelled'

describe('onProjectCompletionDueDateCancelled', () => {
  const projectId = new UniqueEntityID().toString()
  const occurredAt = new Date('2021-11-27')
  const eventId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
    await ProjectEvent.create({
      projectId,
      type: ProjectCompletionDueDateSet.type,
      eventPublishedAt: occurredAt.getTime(),
      id: eventId,
    })
  })

  it('should remove the ProjectCompletionDueDateSet event for this project', async () => {
    await onProjectCompletionDueDateCancelled(
      new ProjectCompletionDueDateCancelled({
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
      where: { projectId, type: ProjectCompletionDueDateSet.type },
    })

    expect(projectEvent).toBeNull()
  })
})
