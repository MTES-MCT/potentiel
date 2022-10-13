import { okAsync } from '@core/utils'
import { makeMettreAJourDateMiseEnService } from './mettreAJourDateMiseEnService'

describe(`Mettre à jour les dates de mise en service`, () => {
  const publishToEventStore = jest.fn(() => okAsync(null))
  const renseignerDateMiseEnService = jest.fn(() => okAsync(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Ajout de la date de mise en service au projet`, () => {
    it(`Étant donné un unique projet par identifiant gestionnaire réseau
        Lorsqu'un évènement 'MiseAJourDateMiseEnServiceDémarrée' survient
        Alors la date de mise en service des projets correspondant devrait être renseignée
        Et la tâche devrait être terminée avec le résultat des mises à jour`, async () => {
      const mettreAJourDateMiseEnService = makeMettreAJourDateMiseEnService({
        getProjetsParIdentifiantGestionnaireRéseau: () =>
          okAsync({
            'NUM-GEST-1': [
              {
                id: 'projet-1',
              },
            ],
            'NUM-GEST-2': [
              {
                id: 'projet-2',
              },
            ],
          }),
        renseignerDateMiseEnService,
        publishToEventStore,
      })

      const miseAJour = await mettreAJourDateMiseEnService({
        gestionnaire: 'Enedis',
        données: [
          {
            identifiantGestionnaireRéseau: 'NUM-GEST-1',
            dateMiseEnService: new Date('2024-01-20'),
          },
          {
            identifiantGestionnaireRéseau: 'NUM-GEST-2',
            dateMiseEnService: new Date('2024-02-20'),
          },
        ],
      })

      expect(miseAJour.isOk()).toBe(true)

      expect(renseignerDateMiseEnService).toHaveBeenCalledTimes(2)
      expect(renseignerDateMiseEnService).toHaveBeenCalledWith({
        projetId: 'projet-1',
        dateMiseEnService: new Date('2024-01-20'),
      })
      expect(renseignerDateMiseEnService).toHaveBeenCalledWith({
        projetId: 'projet-2',
        dateMiseEnService: new Date('2024-02-20'),
      })

      expect(publishToEventStore).toHaveBeenLastCalledWith(
        expect.objectContaining({
          aggregateId: 'import-gestionnaire-réseau#Enedis',
          type: 'MiseAJourDateMiseEnServiceTerminée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            résultat: [
              {
                projetId: 'projet-1',
                état: 'réussie',
              },
              {
                projetId: 'projet-2',
                état: 'réussie',
              },
            ],
          }),
        })
      )
    })
  })
})
