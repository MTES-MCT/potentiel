import { UniqueEntityID } from '@core/domain'
import { EntityNotFoundError } from '@modules/shared'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getAppelOffre } from './getAppelOffre'

const { AppelOffre } = models
const appelOffreId = new UniqueEntityID().toString()

describe('Sequelize getAppelOffre', () => {
  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await AppelOffre.bulkCreate([
      {
        id: appelOffreId,
        data: { param1: 'value1' },
      },
    ])
  })

  describe('when the appel offre exists', () => {
    it('should return the appel offre data', async () => {
      const res = await getAppelOffre(appelOffreId)

      expect(res._unsafeUnwrap()).toMatchObject({
        appelOffreId,
        param1: 'value1',
      })
    })
  })

  describe('when the appel offre does not exist', () => {
    it('should return EntityNotFoundError', async () => {
      const res = await getAppelOffre('nope')

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
    })
  })
})
