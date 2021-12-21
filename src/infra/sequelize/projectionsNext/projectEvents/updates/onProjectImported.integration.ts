import { UniqueEntityID } from '../../../../../core/domain'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import {
  ProjectImported,
  ProjectImportedPayload,
} from '../../../../../modules/project/events/ProjectImported'
import onProjectImported from './onProjectImported'

describe('onProjectImported', () => {
  const projectId = new UniqueEntityID().toString()

  beforeAll(async () => {
    await resetDatabase()

    await onProjectImported(
      new ProjectImported({
        payload: {
          projectId,
        } as ProjectImportedPayload,
      })
    )
  })

  it('should create a new project event of type ProjectImported', async () => {
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({ type: 'ProjectImported' })
  })
})
