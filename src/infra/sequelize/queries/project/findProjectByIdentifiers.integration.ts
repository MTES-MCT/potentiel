import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { findProjectByIdentifiers } from './findProjectByIdentifiers'

const { Project } = models

describe('Sequelize findProjectByIdentifiers', () => {
  describe('when a project with these specific identifiers exists', () => {
    const projectId = new UniqueEntityID().toString()
    const appelOffreId = 'appelOffreId'
    const periodeId = 'periodeId'
    const familleId = 'familleId'
    const numeroCRE = 'numeroCRE'

    it('should return the project id', async () => {
      await resetDatabase()

      const projectInfo = { appelOffreId, periodeId, familleId, numeroCRE }

      await Project.bulkCreate(
        [
          { id: new UniqueEntityID().toString(), ...projectInfo, appelOffreId: 'other' },
          { id: new UniqueEntityID().toString(), ...projectInfo, periodeId: 'other' },
          { id: new UniqueEntityID().toString(), ...projectInfo, familleId: 'other' },
          { id: new UniqueEntityID().toString(), ...projectInfo, numeroCRE: 'other' },
          { id: projectId, ...projectInfo }, // The target
        ].map(makeFakeProject)
      )

      const res = await findProjectByIdentifiers({ appelOffreId, periodeId, numeroCRE, familleId })

      expect(res._unsafeUnwrap()).toEqual(projectId)
    })
  })

  describe('when no project with these specific identifiers exists', () => {
    const appelOffreId = 'appelOffreId'
    const periodeId = 'periodeId'
    const familleId = 'familleId'
    const numeroCRE = 'numeroCRE'

    it('should return null', async () => {
      await resetDatabase()

      const projectInfo = { appelOffreId, periodeId, familleId, numeroCRE }

      await Project.bulkCreate(
        [
          { id: new UniqueEntityID().toString(), ...projectInfo, appelOffreId: 'other' },
          { id: new UniqueEntityID().toString(), ...projectInfo, periodeId: 'other' },
          { id: new UniqueEntityID().toString(), ...projectInfo, familleId: 'other' },
          { id: new UniqueEntityID().toString(), ...projectInfo, numeroCRE: 'other' },
        ].map(makeFakeProject)
      )

      const res = await findProjectByIdentifiers({ appelOffreId, periodeId, numeroCRE, familleId })

      expect(res._unsafeUnwrap()).toEqual(null)
    })
  })
})
