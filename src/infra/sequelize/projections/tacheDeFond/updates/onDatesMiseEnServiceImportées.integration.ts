import { models } from '../../../models'
import { DatesMiseEnServiceImportées } from '@modules/project'
import { onDatesMiseEnServiceImportées } from './onDatesMiseEnServiceImportées'
import { UniqueEntityID } from '@core/domain'

describe('handler onDatesMiseEnServiceImportées', () => {
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
      await onDatesMiseEnServiceImportées(models)(évènement)

      const tacheDeFond = await TacheDeFond.findOne({
        where: { id: évènement.id },
      })

      expect(tacheDeFond.get()).toMatchObject({
        id: évènement.id,
        typeTache: 'mise-à-jour-date-mise-en-service',
        utilisateurId,
        statut: 'en cours',
      })
    })
  })
})
