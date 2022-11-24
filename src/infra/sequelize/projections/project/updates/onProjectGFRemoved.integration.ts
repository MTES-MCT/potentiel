import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onProjectGFRemoved } from './onProjectGFRemoved'
import { ProjectGFRemoved } from '@modules/project'
import { v4 as uuid } from 'uuid'
import makeFakeProjectStep from '../../../../../__tests__/fixtures/projectStep'

describe('project.onProjectGFRemoved', () => {
  const { ProjectStep } = models
  const projectId = uuid()
  const projectStepId1 = uuid()

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('Suppression de la ligne ProjectStep', () => {
    it(`Etant donné une ligne ProjectStep existante
        Lorsque l'évènement ProjectGFRemoved survient
        Alors on supprime la ligne ProjectStep`, async () => {
      await ProjectStep.create(
        makeFakeProjectStep({ id: projectStepId1, projectId, status: 'validé' })
      )
      await onProjectGFRemoved(models)(
        new ProjectGFRemoved({
          payload: { projectId },
        })
      )

      const updatedProjectSteps1 = await ProjectStep.findByPk(projectStepId1)
      expect(updatedProjectSteps1.status).toBeNull()
    })
  })
})
