import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFSubmitted, ProjectGFSubmittedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectGFSubmitted from './onProjectGFSubmitted'

describe('onProjectGFSubmitted', () => {
  const projectId = new UniqueEntityID().toString()
  const date = new Date()

  beforeAll(async () => {
    await resetDatabase()

    await onProjectGFSubmitted(
      new ProjectGFSubmitted({
        payload: {
          projectId,
          fileId: 'file-id',
          submittedBy: 'someone',
        } as ProjectGFSubmittedPayload,
      })
    )
  })

  it('should create a new project event of type ProjectGFSubmitted', async () => {
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectGFSubmitted',
    })
  })
})
