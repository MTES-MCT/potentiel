import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFSubmitted, ProjectGFSubmittedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectGFSubmitted from './onProjectGFSubmitted'

describe('onProjectGFSubmitted', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = 'file-id'
  const submittedBy = 'someone'

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectGFSubmitted', async () => {
    const occurredAt = new Date('04-01-2022')

    await onProjectGFSubmitted(
      new ProjectGFSubmitted({
        payload: {
          projectId,
          fileId,
          submittedBy,
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
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
    })
  })

  describe('when the event already exists in the projection ProjectEvent', () => {
    it('should not create a new project event of type ProjectGFSubmitted', async () => {
      const occurredAt = new Date('04-01-2022')

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectGFSubmitted',
        payload: { fileId, submittedBy },
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
      })

      await onProjectGFSubmitted(
        new ProjectGFSubmitted({
          payload: {
            projectId,
            fileId,
            submittedBy,
          } as ProjectGFSubmittedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvents = await ProjectEvent.findAll({
        where: {
          projectId,
          type: 'ProjectGFSubmitted',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
        },
      })

      expect(projectEvents).toHaveLength(1)
      expect(projectEvents[0]).toMatchObject({
        payload: { fileId, submittedBy },
      })
    })
  })
})
