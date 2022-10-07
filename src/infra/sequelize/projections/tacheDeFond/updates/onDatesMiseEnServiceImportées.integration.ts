import { models } from '../../../models'
import { ImportDatesDeMiseEnServiceDémarré } from '@modules/project'
import { onImportDatesDeMiseEnServiceDémarré } from './onImportDatesDeMiseEnServiceDémarré'
import { UniqueEntityID } from '@core/domain'

describe('handler onImportDatesDeMiseEnServiceDémarré', () => {
  const { TacheDeFond } = models

  describe(`Créer une nouvelle tâche de fond`, () => {
    it(`Lorsqu'un évènement ImportDatesDeMiseEnServiceDémarré est émis,
      Alors une nouvelle entrée est insérée dans la table TacheDeFond avec le statut 'en cours'`, async () => {
      const utilisateurId = new UniqueEntityID().toString()
      const évènement = new ImportDatesDeMiseEnServiceDémarré({
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
      await onImportDatesDeMiseEnServiceDémarré(models)(évènement)

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
