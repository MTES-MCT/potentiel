import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { isGarantiesFinancieresDeposeesALaCandidature } from './isGarantiesFinancieresDeposeesALaCandidature'

describe('isGarantiesFinancieresDeposeesALaCandidature', () => {
  const { Project } = models
  beforeEach(async () => {
    await resetDatabase()
  })
  describe('when the GF have been submitted at application', () => {
    it('should return true', async () => {
      const projectId = new UniqueEntityID().toString()
      const appelOffreId = 'PPE2 - Neutre'
      const periodeId = '1'
      const familleId = '1'
      const fakeProject = makeFakeProject({ projectId, appelOffreId, periodeId, familleId })
      await Project.create(fakeProject)

      const result = await isGarantiesFinancieresDeposeesALaCandidature(projectId)

      expect(result.isOk()).toEqual(true)
    })
  })
})
