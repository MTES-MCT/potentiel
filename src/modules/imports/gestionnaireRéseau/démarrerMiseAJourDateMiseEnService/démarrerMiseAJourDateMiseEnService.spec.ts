import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import { makeMettreAJourDateMiseEnService } from './mettreAJourDateMiseEnService'

describe(`Mettre à jour les dates de mise en service`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Démarrer la mise à jour des dates de mise en service au démarrage de l'import`, () => {
    it(`Lorsqu'un évènement 'MiseAJourDateMiseEnServiceDémarrée' survient
        Alors la date de mise en service des projets correspondant devrait être mises à jour
        Et la tâche devrait être terminée`, async () => {
      const mettreAJourDateMiseEnService = makeMettreAJourDateMiseEnService({
        getProjetsParIdentifiantGestionnaireRéseau: () =>
          okAsync([
            {
              id: 'projet-1',
              identifiantGestionnaireRéseau: 'NUM-GEST-1',
              dateMiseEnService: undefined,
            },
            {
              id: 'projet-2',
              identifiantGestionnaireRéseau: 'NUM-GEST-2',
              dateMiseEnService: undefined,
            },
          ]),
        publishToEventStore,
      })

      const démarrage = await mettreAJourDateMiseEnService([
        { numeroGestionnaire: 'NUM-GEST-1', dateMiseEnService: new Date('2024-01-20') },
        { numeroGestionnaire: 'NUM-GEST-2', dateMiseEnService: new Date('2024-02-20') },
      ])

      expect(démarrage.isOk()).toBe(true)

      expect(publishToEventStore).toHaveBeenCalledTimes(2)
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          aggregateId: 'import-gestionnaire-réseau#Enedis',
          type: 'MiseAJourDateMiseEnServiceDémarrée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            dates: [
              {
                numeroGestionnaire: 'NUM-GEST-1',
                dateMiseEnService: new Date('2024-01-20').toISOString(),
              },
              {
                numeroGestionnaire: 'NUM-GEST-2',
                dateMiseEnService: new Date('2024-02-20').toISOString(),
              },
            ],
          }),
        })
      )
      expect(publishToEventStore).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          aggregateId: 'import-gestionnaire-réseau#Enedis',
          type: 'ImportGestionnaireRéseauDémarré',
          payload: expect.objectContaining({
            démarréPar: utilisateurAutorisé.id,
            gestionnaire: 'Enedis',
          }),
        })
      )
    })
  })
})
