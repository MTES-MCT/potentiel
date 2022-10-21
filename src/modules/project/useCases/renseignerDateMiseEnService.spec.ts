import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { DateMiseEnServicePlusRécenteError } from '../errors'
import { DateMiseEnServiceRenseignée } from '../events'
import { Project } from '../Project'
import { makeRenseignerDateMiseEnService } from './renseignerDateMiseEnService'

describe('Renseigner une date de mise en service', () => {
  const projetId = new UniqueEntityID().toString()
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  describe(`Impossible de renseigner une date de mise en service plus récente que celle du projet`, () => {
    it(`Étant donné un projet avec une date de mise en service existante
        Lorsqu'on renseigne une nouvelle date de mise en service pour ce projet et que celle-ci est plus récente que celle du projet
        Alors on devrait être averti qu'il n'est pas possible de renseigner une date plus récente que celle du projet
        Et aucun évènement ne devrait être émis`, async () => {
      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        id: projetId,
        dateMiseEnService: new Date('2022-01-01'),
      } as Project)

      const renseignerDateMiseEnService = makeRenseignerDateMiseEnService({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDateMiseEnService({
        projetId,
        dateMiseEnService: new Date('2023-01-01'),
      })

      expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(DateMiseEnServicePlusRécenteError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Ne pas renseigner une date de mise en service si identique à celle du projet`, () => {
    it(`Lorsqu'on renseigne une nouvelle date de mise en service et que celle-ci est identique à celle du projet
        Alors aucun évènment ne devrait être émis`, async () => {
      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        id: projetId,
        dateMiseEnService: new Date('2022-01-01'),
      } as Project)

      const renseignerDateMiseEnService = makeRenseignerDateMiseEnService({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDateMiseEnService({
        projetId,
        dateMiseEnService: new Date('2022-01-01'),
      })

      expect(résultat.isOk()).toBe(true)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Renseigner une date de mise en service`, () => {
    it(`Lorsqu'on renseigne pour un projet une nouvelle date de mise en service
        Alors cette date de mise en service du projet devrait être celle du projet`, async () => {
      const dateMiseEnService = new Date('2023-01-01')
      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        id: projetId,
      } as Project)

      const renseignerDateMiseEnService = makeRenseignerDateMiseEnService({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDateMiseEnService({
        projetId,
        dateMiseEnService,
      })

      expect(résultat.isOk()).toBe(true)
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: DateMiseEnServiceRenseignée.type,
          payload: expect.objectContaining({
            projetId,
            dateMiseEnService: dateMiseEnService.toISOString(),
          }),
        })
      )
    })
  })
})
