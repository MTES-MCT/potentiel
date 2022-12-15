import { UniqueEntityID } from '@core/domain'
import { ProjectPTFRemoved } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectStepRemoved } from './onProjectStepRemoved'

describe('projectStep.onProjectStepRemoved', () => {
  const { ProjectStep } = models

  const projectId = new UniqueEntityID().toString()

  describe('when event is ProjectPTFRemoved', () => {
    beforeAll(async () => {
      await resetDatabase()

      await ProjectStep.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ptf',
        stepDate: new Date(123),
        fileId: new UniqueEntityID().toString(),
        submittedBy: new UniqueEntityID().toString(),
        submittedOn: new Date(1234),
        status: 'à traiter',
      })

      expect(await ProjectStep.count({ where: { projectId, type: 'ptf' } })).toEqual(1)
    })

    it('should remove the project ptf step', async () => {
      const event = new ProjectPTFRemoved({
        payload: {
          projectId,
          removedBy: new UniqueEntityID().toString(),
        },
      })
      await onProjectStepRemoved(models)(event)

      expect(await ProjectStep.count({ where: { projectId, type: 'ptf' } })).toEqual(0)
    })
  })
})
