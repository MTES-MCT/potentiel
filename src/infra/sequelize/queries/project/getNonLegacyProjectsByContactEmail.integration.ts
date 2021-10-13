import models from '../../models'
import { resetDatabase } from '../../helpers'
import makeFakeProject from '../../../../__tests__/fixtures/project'

import { getNonLegacyProjectsByContactEmail } from './getNonLegacyProjectsByContactEmail'
import { UniqueEntityID } from '../../../../core/domain'

const { Project } = models

describe('Sequelize getNonLegacyProjectsByContactEmail', () => {
  const projectId = new UniqueEntityID().toString()
  const email = 'test@test.test'

  describe('given an email', () => {
    beforeAll(async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeFakeProject({
          id: projectId,
          appelOffreId: 'Fessenheim',
          periodeId: '2',
          email,
        }),
        makeFakeProject({
          email: 'other@test.test', // wrong email
          appelOffreId: 'Fessenheim',
          periodeId: '2',
        }),
        makeFakeProject({
          appelOffreId: 'Fessenheim',
          periodeId: '1', // Legacy periode
          email,
        }),
      ])
    })

    it('should return a list of ids for non-legacy projects with that email as contact email', async () => {
      const res = await getNonLegacyProjectsByContactEmail(email)

      expect(res._unsafeUnwrap()).toEqual([projectId])
    })
  })
})
