import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRSubmitted, ProjectDCRSubmittedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectDCRSubmitted from './onProjectDCRSubmitted'

describe('onProjectDCRSubmitted', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = 'file-id'
  const occurredAt = new Date('2022-01-04')
  const submittedBy = 'user-id'
  const dcrDate = new Date('2021-12-26')

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectDCRSubmitted', async () => {
    await onProjectDCRSubmitted(
      new ProjectDCRSubmitted({
        payload: {
          projectId,
          fileId,
          submittedBy,
          dcrDate,
        } as ProjectDCRSubmittedPayload,
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
      type: 'ProjectDCRSubmitted',
      valueDate: dcrDate.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { fileId, submittedBy },
    })
  })
})
