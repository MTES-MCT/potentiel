import { UniqueEntityID } from '@core/domain'
import { ProjectPTFSubmitted } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectStepSubmitted } from './onProjectStepSubmitted'

describe('projectStep.onProjectStepSubmitted', () => {
  const { ProjectStep } = models

  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()

  beforeEach(async () => await resetDatabase())

  describe('when event is ProjectPTFSubmitted', () => {
    it('should create a new ptf step with a "à traiter" status', async () => {
      const event = new ProjectPTFSubmitted({
        payload: {
          projectId,
          ptfDate: new Date(123),
          fileId,
          submittedBy: userId,
        },
        original: {
          version: 1,
          occurredAt: new Date(345),
        },
      })
      await onProjectStepSubmitted(models)(event)

      const projection = await ProjectStep.findOne({ where: { projectId } })

      expect(projection).toBeTruthy()
      if (!projection) return

      expect(projection.get()).toMatchObject({
        type: 'ptf',
        projectId,
        stepDate: new Date(123),
        fileId,
        submittedBy: userId,
        submittedOn: new Date(345),
        details: null,
        status: 'à traiter',
      })
    })
  })
})
