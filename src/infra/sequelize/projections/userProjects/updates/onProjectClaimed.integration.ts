import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectClaimed } from '../../../../../modules/project/events'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectClaimed } from './onProjectClaimed'

describe('projectStep.onProjectClaimed', () => {
  const { ProjectStep } = models

  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const certificateFileId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when event is ProjectClaimed', () => {
    it('should create a new attestation-designation-proof step', async () => {
      const event = new ProjectClaimed({
        payload: {
          projectId,
          certificateFileId,
          claimedBy: userId,
        },
        original: {
          version: 1,
          occurredAt: new Date(456),
        },
      })

      await onProjectClaimed(models)(event)

      const projection = await ProjectStep.findOne({ where: { projectId } })

      expect(projection).toBeTruthy()
      if (!projection) return

      expect(projection.get()).toMatchObject({
        type: 'attestation-designation-proof',
        projectId,
        stepDate: new Date(123),
        fileId: certificateFileId,
        submittedBy: userId,
        submittedOn: new Date(456),
        details: null,
      })
    })
  })
})
