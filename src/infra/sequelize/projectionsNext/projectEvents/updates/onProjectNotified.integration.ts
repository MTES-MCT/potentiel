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
    const notifiedOnTimestamp = new Date('2022-01-06').getTime()
    const eventDate = new Date('2021-12-15')
    await onProjectNotified(
      new ProjectNotified({
        payload: {
          projectId,
          notifiedOn: notifiedOnTimestamp,
        } as ProjectNotifiedPayload,
        original: {
          version: 1,
          occurredAt: eventDate,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({
      type: 'ProjectNotified',
      valueDate: notifiedOnTimestamp,
      eventPublishedAt: eventDate.getTime(),
    })
  })
})
