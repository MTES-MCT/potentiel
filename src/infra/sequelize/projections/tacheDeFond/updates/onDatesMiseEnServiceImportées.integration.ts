import { models } from '../../../models'
import { DatesMiseEnServiceImportées } from '@modules/project'
import { onDatesMiseEnServiceImportées } from './onDatesMiseEnServiceImportées'
import { UniqueEntityID } from '@core/domain'
// import { resetDatabase } from '@infra/sequelize/helpers'

describe('handler onDatesMiseEnServiceImportées', () => {
  // beforeEach(async () => {
  //   await resetDatabase()
  // })
  const { TacheDeFond } = models

  describe(`Créer une nouvelle tâche de fond`, () => {
    it(`Lorsqu'un évènement DatesMiseEnServiceImportées est émis,
      Alors une nouvelle entrée est insérée dans la table TacheDeFond avec le statut 'en cours'`, async () => {
      const utilisateurId = new UniqueEntityID().toString()
      const évènement = new DatesMiseEnServiceImportées({
        payload: {
          utilisateurId,
          datesParNumeroDeGestionnaire: [
            {
              numéroGestionnaire: 'ndg01',
              dateDeMiseEnService: '01/01/2022',
            },
          ],
        },
      })
      console.log('pre')
      onDatesMiseEnServiceImportées(évènement)
      console.log('post')
      const tacheDeFond = await TacheDeFond.findOne({
        where: { id: évènement.id },
      })

      console.log(tacheDeFond)

      expect(tacheDeFond).not.toBe(null)
      expect(tacheDeFond).toMatchObject({
        id: évènement.id,
        typeTache: 'mise-à-jour-date-mise-en-service',
        utilisateurId,
        status: 'en cours',
      })
    })
  })
})
