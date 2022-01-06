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
    const eventDate = new Date('2022-01-04')

    await onProjectImported(
      new ProjectImported({
        payload: {
          projectId,
        } as ProjectImportedPayload,
        original: {
          version: 1,
          occurredAt: eventDate,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectImported',
      valueDate: eventDate.getTime(),
      eventPublishedAt: eventDate.getTime(),
    })
  })

  describe(`when the event already exists in the projection`, () => {
    it('should not create a new project event of type ProjectImported', async () => {
      const eventDate = new Date('2021-12-15')

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectImported',
        valueDate: eventDate.getTime(),
        eventPublishedAt: eventDate.getTime(),
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
        where: {
          projectId,
          type: 'ProjectImported',
          valueDate: eventDate.getTime(),
          eventPublishedAt: eventDate.getTime(),
        },
      })

      expect(projectEvents).toHaveLength(1)
    })
  })
})
