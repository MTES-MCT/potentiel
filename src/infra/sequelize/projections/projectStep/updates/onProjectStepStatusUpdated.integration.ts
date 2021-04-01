import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectStepStatusUpdated } from '../../../../../modules/project/events'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectStepStatusUpdated } from './onProjectStepStatusUpdated'

describe('projectStep.onProjectStepStatusUpdated', () => {
  const { ProjectStep } = models

  const projectId = new UniqueEntityID().toString()

  describe('when event is ProjectStepStatusUpdated', () => {
    beforeAll(async () => {
      await resetDatabase()
    })

    it(`should update the step status to 'validé' when it is set to 'à traiter`, async () => {
      const { id: projectStepId } = await ProjectStep.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'gf',
        stepDate: new Date(123),
        fileId: new UniqueEntityID().toString(),
        submittedBy: new UniqueEntityID().toString(),
        submittedOn: new Date(1234),
        status: 'à traiter',
      })

      expect(await ProjectStep.findByPk(projectStepId)).toBeDefined()

      const event = new ProjectStepStatusUpdated({
        payload: {
          projectStepId,
          updatedBy: new UniqueEntityID().toString(),
          newStatus: 'validé',
        },
      })

      await onProjectStepStatusUpdated(models)(event)

      const projectStep = await ProjectStep.findByPk(projectStepId)
      expect(projectStep.status).toStrictEqual('validé')
    })

    it(`should update the step status to 'à traiter' when it is set to 'validé`, async () => {
      const { id: projectStepId } = await ProjectStep.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'gf',
        stepDate: new Date(123),
        fileId: new UniqueEntityID().toString(),
        submittedBy: new UniqueEntityID().toString(),
        submittedOn: new Date(1234),
        status: 'validé',
      })

      expect(await ProjectStep.findByPk(projectStepId)).toBeDefined()

      const event = new ProjectStepStatusUpdated({
        payload: {
          projectStepId,
          updatedBy: new UniqueEntityID().toString(),
          newStatus: 'à traiter',
        },
      })

      await onProjectStepStatusUpdated(models)(event)

      const projectStep = await ProjectStep.findByPk(projectStepId)
      expect(projectStep.status).toStrictEqual('à traiter')
    })
  })
})
