import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ProjectCompletionDueDateSet, ProjectCompletionDueDateSetPayload } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'
import onProjectCompletionDueDateSet from './onProjectCompletionDueDateSet'

describe('onProjectCompletionDueDateSet', () => {
  const projectId = new UniqueEntityID().toString()
  const completionDueOn = new Date('2024-01-01').getTime()
  const occurredAt = new Date('2022-01-01')

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectCompletionDueDateSet', async () => {
    await onProjectCompletionDueDateSet(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId,
          completionDueOn,
        } as ProjectCompletionDueDateSetPayload,
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
      type: 'ProjectCompletionDueDateSet',
      eventPublishedAt: occurredAt.getTime(),
      valueDate: completionDueOn,
    })
  })
})
