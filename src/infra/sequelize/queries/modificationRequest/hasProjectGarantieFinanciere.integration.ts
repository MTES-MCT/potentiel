import { UniqueEntityID } from '../../../../core/domain'
import makeFakeProjectStep from '../../../../__tests__/fixtures/projectStep'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { hasProjectGarantieFinanciere } from './hasProjectGarantieFinanciere'

const { ProjectStep } = models

const projectId = new UniqueEntityID().toString()

describe('Sequelize hasProjectGarantieFinanciere', () => {
  describe('when project has GF step', () => {
    it('should return true', async () => {
      await resetDatabase()

      await ProjectStep.create(makeFakeProjectStep({ projectId, type: 'garantie-financiere' }))

      expect((await hasProjectGarantieFinanciere(projectId))._unsafeUnwrap()).toEqual(true)
    })
  })

  describe('when project has no GF step', () => {
    it('should return false', async () => {
      await resetDatabase()

      expect((await hasProjectGarantieFinanciere(projectId))._unsafeUnwrap()).toEqual(false)
    })
  })
})
