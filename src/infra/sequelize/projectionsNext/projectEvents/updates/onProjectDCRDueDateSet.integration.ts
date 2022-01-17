import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRDueDateSet, ProjectDCRDueDateSetPayload } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectDCRDueDateSet from './onProjectDCRDueDateSet'

describe('onProjectDCRDueDateSet', () => {
  const projectId = new UniqueEntityID().toString()
  const dcrDueOn = new Date('2022-01-27').getTime()
  const occurredAt = new Date('2021-11-27')

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectDCRDueDateSet', async () => {
    await onProjectDCRDueDateSet(
      new ProjectDCRDueDateSet({
        payload: {
          projectId,
          dcrDueOn,
        } as ProjectDCRDueDateSetPayload,
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
      type: 'ProjectDCRDueDateSet',
      eventPublishedAt: occurredAt.getTime(),
      valueDate: dcrDueOn,
    })
  })
})
