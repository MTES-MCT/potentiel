import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectClaimed } from '../../../../../modules/projectClaim'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectClaimed from './onProjectClaimed'

describe('onProjectClaimed', () => {
  const projectId = new UniqueEntityID().toString()
  const claimedBy = new UniqueEntityID().toString()
  const attestationDesignationFileId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectClaimed', async () => {
    const occurredAt = new Date('04-01-2022')

    await onProjectClaimed(
      new ProjectClaimed({
        payload: {
          projectId,
          claimedBy,
          attestationDesignationFileId,
          claimerEmail: '',
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({
      type: 'ProjectClaimed',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { claimedBy, attestationDesignationFileId },
    })
  })

  describe(`when the event already exists in the projection`, () => {
    it('should not create a new project event of type ProjectClaimed', async () => {
      const occurredAt = new Date('04-01-2022')

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectClaimed',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: { claimedBy, attestationDesignationFileId },
      })

      await onProjectClaimed(
        new ProjectClaimed({
          payload: {
            projectId,
            claimedBy,
            attestationDesignationFileId,
            claimerEmail: '',
          },
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvents = await ProjectEvent.findAll({
        where: {
          projectId,
          type: 'ProjectClaimed',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
        },
      })

      expect(projectEvents).toHaveLength(1)

      expect(projectEvents[0]).toMatchObject({
        payload: { claimedBy, attestationDesignationFileId },
      })
    })
  })
})
