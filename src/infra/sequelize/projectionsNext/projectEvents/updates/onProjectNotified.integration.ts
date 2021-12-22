import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectNotified, ProjectNotifiedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectNotified from './onProjectNotified'

describe('onProjectNotified', () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectNotified', async () => {
    await onProjectNotified(
      new ProjectNotified({
        payload: {
          projectId,
          notifiedOn: new Date('2021-12-15').getTime(),
        } as ProjectNotifiedPayload,
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({
      type: 'ProjectNotified',
      valueDate: new Date('2021-12-15').getTime(),
    })
  })

  describe(`when the event already exists in the projection`, () => {
    it('should not create a new project event of type ProjectNotified', async () => {
      const eventDate = new Date('2021-12-15')

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectNotified',
        valueDate: eventDate.getTime(),
      })

      await onProjectNotified(
        new ProjectNotified({
          payload: {
            projectId,
            notifiedOn: eventDate.getTime(),
          } as ProjectNotifiedPayload,
        })
      )

      const projectEvents = await ProjectEvent.findAll({
        where: { projectId, type: 'ProjectNotified', valueDate: eventDate.getTime() },
      })

      expect(projectEvents).toHaveLength(1)
    })
  })
})
