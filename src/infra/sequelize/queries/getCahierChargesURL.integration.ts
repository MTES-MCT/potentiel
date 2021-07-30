import { UniqueEntityID } from '../../../core/domain'
import { resetDatabase } from '../helpers'
import models from '../models'
import { makeGetCahiersChargesURLs } from './getCahierChargesURL'

describe('Sequelize getCahierChargesURL', () => {
  const getCahiersChargesURLs = makeGetCahiersChargesURLs(models)
  const { Periode } = models

  const appelOffreId = new UniqueEntityID().toString()
  const periodeId = new UniqueEntityID().toString()
  const newURL = 'newURL'
  const oldURL = 'oldURL'

  beforeAll(async () => {
    await resetDatabase()

    await Periode.bulkCreate([
      {
        appelOffreId,
        periodeId,
        data: {
          "Lien de l'ancien cahier des charges": 'oldURL',
          'Lien du nouveau cahier des charges': 'newURL',
        },
      },
    ])
  })

  describe('when the periode exists', () => {
    it('should return the old and the new cahierChargesURLs', async () => {
      const res = await getCahiersChargesURLs(appelOffreId, periodeId)
      const unwrappedRes = res._unsafeUnwrap()

      expect(unwrappedRes?.oldCahierChargesURL).toEqual(oldURL)
      expect(unwrappedRes?.newCahierChargesURL).toEqual(newURL)
    })
  })

  describe('when the periode does not exist', () => {
    it('should return undefined', async () => {
      const res = await getCahiersChargesURLs(appelOffreId, 'nope')
      expect(res._unsafeUnwrap()).toBeUndefined()
    })
  })

  describe('when the appel offre does not exist', () => {
    it('should return undefined', async () => {
      const res = await getCahiersChargesURLs('nope', periodeId)
      expect(res._unsafeUnwrap()).toBeUndefined()
    })
  })
})
