import { UniqueEntityID } from '../../../core/domain'
import { EntityNotFoundError } from '../../../modules/shared'
import { resetDatabase } from '../helpers'
import models from '../models'
import { makeGetCahierChargesURL } from './getCahierChargesURL'

describe('Sequelize getCahierChargesURL', () => {
  const getCahierChargesURL = makeGetCahierChargesURL(models)
  const { Periode } = models

  const appelOffreId = new UniqueEntityID().toString()
  const periodeId = new UniqueEntityID().toString()

  beforeAll(async () => {
    await resetDatabase()

    await Periode.bulkCreate([
      {
        appelOffreId,
        periodeId,
        data: { 'Lien du cahier des charges': 'url' },
      },
    ])
  })

  describe('when the periode exists', () => {
    it('should return the cahierChargesURL', async () => {
      const res = await getCahierChargesURL(appelOffreId, periodeId)
      expect(res._unsafeUnwrap()).toEqual('url')
    })
  })

  describe('when the periode does not exist', () => {
    it('should return EntityNotFoundError', async () => {
      const res = await getCahierChargesURL(appelOffreId, 'nope')
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
    })
  })

  describe('when the appel offre does not exist', () => {
    it('should return EntityNotFoundError', async () => {
      const res = await getCahierChargesURL('nope', periodeId)
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
    })
  })
})
