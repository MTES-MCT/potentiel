import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { DateMiseEnServicePlusRécenteError } from '../errors'
import { DonnéesDeRaccordementRenseignées } from '../events'
import { Project } from '../Project'
import { makeRenseignerDonnéesDeRaccordement } from './renseignerDonnéesDeRaccordement'

describe('Renseigner des données de raccordement', () => {
  const projetId = new UniqueEntityID().toString()
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  describe(`Impossible de renseigner des données de raccordement avec une date de mise en service plus récente`, () => {
    it(`Étant donné un projet avec une date de mise en service
        Lorsqu'on renseigne des données de raccordement avec une date de mise en service plus récente que celle du projet
        Alors on devrait être averti qu'il n'est pas possible de renseigner des données de raccordement avec une date plus récente
        Et aucun évènement ne devrait être émis`, async () => {
      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        id: projetId,
        dateMiseEnService: new Date('2022-01-01'),
      } as Project)

      const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDonnéesDeRaccordement({
        projetId,
        dateMiseEnService: new Date('2023-01-01'),
      })

      expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(DateMiseEnServicePlusRécenteError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Ne pas renseigner des données de raccordement avec une date de mise en service identique`, () => {
    it(`Lorsqu'on renseigne des données de raccordement avec une date de mise en service identique à celle du projet
        Alors aucun évènment ne devrait être émis`, async () => {
      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        id: projetId,
        dateMiseEnService: new Date('2022-01-01'),
      } as Project)

      const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDonnéesDeRaccordement({
        projetId,
        dateMiseEnService: new Date('2022-01-01'),
      })

      expect(résultat.isOk()).toBe(true)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Renseigner des données de raccordement`, () => {
    it(`Lorsqu'on renseigne des données de raccordement pour un projet avec :
          - une date de mise en service au 01/01/2024
          - et une date en file d'attente au 31/12/2022
        Alors les données de raccordement devrait être renseignées pour le projet
        Et la date de mise en service devrait être 01/01/2024
        Et la date en file d'attente devrait être 31/12/2022`, async () => {
      const dateMiseEnService = new Date('2024-01-01')
      const dateFileAttente = new Date('2022-12-31')

      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        id: projetId,
      } as Project)

      const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDonnéesDeRaccordement({
        projetId,
        dateMiseEnService,
        dateFileAttente,
      })

      expect(résultat.isOk()).toBe(true)
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: DonnéesDeRaccordementRenseignées.type,
          payload: expect.objectContaining({
            projetId,
            dateMiseEnService: dateMiseEnService.toISOString(),
            dateFileAttente: dateFileAttente.toISOString(),
          }),
        })
      )
    })
  })
})
