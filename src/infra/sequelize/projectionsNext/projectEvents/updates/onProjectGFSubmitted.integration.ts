import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFSubmitted, ProjectGFSubmittedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectGFSubmitted from './onProjectGFSubmitted'

describe('onProjectGFSubmitted', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = 'file-id'
  const occurredAt = new Date('2022-01-04')
  const submittedBy = 'user-id'
  const gfDate = new Date('2021-12-26')

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectGFSubmitted', async () => {
    await onProjectGFSubmitted(
      new ProjectGFSubmitted({
        payload: {
          projectId,
          fileId,
          submittedBy,
          gfDate,
        } as ProjectGFSubmittedPayload,
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectGFSubmitted',
      valueDate: gfDate.getTime(),
      eventPublishedAt: occurredAt.getTime(),
    })
  })
})
