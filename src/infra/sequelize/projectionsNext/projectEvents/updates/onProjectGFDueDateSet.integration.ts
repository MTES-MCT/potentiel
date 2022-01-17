import { UniqueEntityID } from '@core/domain'
import { ProjectGFDueDateSet, ProjectGFDueDateSetPayload } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectGFDueDateSet from './onProjectGFDueDateSet'

describe('onProjectGFDueDateSet', () => {
  const projectId = new UniqueEntityID().toString()
  const garantiesFinancieresDueOn = new Date('2022-01-27').getTime()
  const occurredAt = new Date('2021-11-27')

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectGFDueDateSet', async () => {
    await onProjectGFDueDateSet(
      new ProjectGFDueDateSet({
        payload: {
          projectId,
          garantiesFinancieresDueOn,
        } as ProjectGFDueDateSetPayload,
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
      type: 'ProjectGFDueDateSet',
      eventPublishedAt: occurredAt.getTime(),
      valueDate: garantiesFinancieresDueOn,
    })
  })
})
