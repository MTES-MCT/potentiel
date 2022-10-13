import { okAsync } from '@core/utils'
import { makeMettreAJourDateMiseEnService } from './mettreAJourDateMiseEnService'

describe(`Mettre à jour les dates de mise en service`, () => {
  const publishToEventStore = jest.fn(() => okAsync(null))
  const renseignerDateMiseEnService = jest.fn(() => okAsync(null))

  beforeEach(() => {
    publishToEventStore.mockClear()
    renseignerDateMiseEnService.mockClear()
  })

  describe(`Mise à jour de toutes les dates de mise en service des projets`, () => {
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
                identifiantGestionnaireRéseau: 'NUM-GEST-1',
                projetId: 'projet-1',
                état: 'succès',
              },
              {
                identifiantGestionnaireRéseau: 'NUM-GEST-2',
                projetId: 'projet-2',
                état: 'succès',
              },
            ],
          }),
        })
      )
    })
  })

  describe(`Ne pas mettre à jour si plusieurs résultats pour un identifiant`, () => {
    it(`Étant donné plusieurs projets avec l'identifiant gestionnaire de réseau 'Enedis'
        Et le projet 'Projet Test' avec l'identifiant 'AAA-BB-2022-000001'
        Lorsqu'un évènement 'MiseAJourDateMiseEnServiceDémarrée' survient
        Alors la date de mise en service devrait être renseignée seulement pour le projet 'Projet Test'
        Et la tâche devrait être terminée 
        Et le résultat devrait être 'succès' pour l'identifiant 'AAA-BB-2022-000001'
        Et devrait être 'échouée' pour 'Enedis' avec la raison 'Plusieurs projets correspondent à l'identifiant'`, async () => {
      const mettreAJourDateMiseEnService = makeMettreAJourDateMiseEnService({
        getProjetsParIdentifiantGestionnaireRéseau: () =>
          okAsync({
            Enedis: [
              {
                id: 'projet-1',
              },
              {
                id: 'projet-2',
              },
            ],
            'AAA-BB-2022-000001': [
              {
                id: 'Projet Test',
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
            identifiantGestionnaireRéseau: 'Enedis',
            dateMiseEnService: new Date('2024-01-20'),
          },
          {
            identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
            dateMiseEnService: new Date('2024-02-20'),
          },
        ],
      })

      expect(miseAJour.isOk()).toBe(true)

      expect(renseignerDateMiseEnService).toHaveBeenCalledTimes(1)
      expect(renseignerDateMiseEnService).toHaveBeenCalledWith({
        projetId: 'Projet Test',
        dateMiseEnService: new Date('2024-02-20'),
      })
      expect(renseignerDateMiseEnService).not.toHaveBeenCalledWith(
        expect.objectContaining({
          dateMiseEnService: new Date('2024-01-20'),
        })
      )

      expect(publishToEventStore).toHaveBeenLastCalledWith(
        expect.objectContaining({
          aggregateId: 'import-gestionnaire-réseau#Enedis',
          type: 'MiseAJourDateMiseEnServiceTerminée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            résultat: expect.arrayContaining([
              {
                identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
                projetId: 'Projet Test',
                état: 'succès',
              },
              {
                identifiantGestionnaireRéseau: 'Enedis',
                état: 'échec',
                raison: `Plusieurs projets correspondent à l'identifiant gestionnaire de réseau`,
              },
            ]),
          }),
        })
      )
    })
  })
})
