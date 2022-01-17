import { UniqueEntityID } from '@core/domain'
import { FileNotFoundError } from '@modules/file'
import { EntityNotFoundError } from '@modules/shared'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getPeriode } from './getPeriode'

const { Periode } = models
describe('Sequelize getPeriode', () => {
  const appelOffreId = new UniqueEntityID().toString()
  const periodeId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await Periode.bulkCreate([
      {
        appelOffreId,
        periodeId,
        data: { param1: 'value1' },
      },
    ])
  })

  describe('when the periode exists', () => {
    it('should return the periode data', async () => {
      const res = await getPeriode(appelOffreId, periodeId)

      expect(res._unsafeUnwrap()).toMatchObject({
        appelOffreId,
        periodeId,
        param1: 'value1',
      })
    })
  })

  describe('when the periode does not exist', () => {
    it('should return EntityNotFoundError', async () => {
      const res = await getPeriode(appelOffreId, 'nope')

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
    })
  })

  describe('when the appel offre does not exist', () => {
    it('should return EntityNotFoundError', async () => {
      const res = await getPeriode('nope', periodeId)

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
    })
  })
})
