import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectNotified, ProjectNotifiedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectNotified from './onProjectNotified'

describe('onProjectNotified', () => {
  const projectId = new UniqueEntityID().toString()

  beforeAll(async () => {
    await resetDatabase()

    await onProjectNotified(
      new ProjectNotified({
        payload: {
          projectId,
          notifiedOn: 1234,
        } as ProjectNotifiedPayload,
      })
    )
  })

  it('should create a new project event of type ProjectNotified', async () => {
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({ type: 'ProjectNotified', valueDate: 1234 })
  })
})
