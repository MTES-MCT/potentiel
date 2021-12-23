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

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectImported', async () => {
    await onProjectImported(
      new ProjectImported({
        payload: {
          projectId,
        } as ProjectImportedPayload,
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({ type: 'ProjectImported' })
  })

  describe(`when the event already exists in the projection`, () => {
    it('should not create a new project event of type ProjectImported', async () => {
      const eventDate = new Date('2021-12-15')

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectImported',
        valueDate: eventDate.getTime(),
      })

      await onProjectImported(
        new ProjectImported({
          payload: {
            projectId,
          } as ProjectImportedPayload,
          original: {
            occurredAt: eventDate,
            version: 1,
          },
        })
      )

      const projectEvents = await ProjectEvent.findAll({
        where: { projectId, type: 'ProjectImported', valueDate: eventDate.getTime() },
      })

      expect(projectEvents).toHaveLength(1)
    })
  })
})
