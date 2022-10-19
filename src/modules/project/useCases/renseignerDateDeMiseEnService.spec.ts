import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { DateDeMiseEnServicePlusRécenteError } from '../errors'
import { DateDeMiseEnServiceRenseignée } from '../events'
import { Project } from '../Project'
import { makeRenseignerDateDeMiseEnService } from './renseignerDateDeMiseEnService'

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
        dateDeMiseEnService: new Date('2022-01-01'),
      } as Project)

      const renseignerDateMiseEnService = makeRenseignerDateDeMiseEnService({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDateMiseEnService({
        projetId,
        dateDeMiseEnService: new Date('2023-01-01'),
      })

      expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(DateDeMiseEnServicePlusRécenteError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Renseigner une date de mise en service`, () => {
    it(`Étant donné un projet
        Lorsqu'on renseigne une nouvelle date de mise en service pour ce projet
        Alors cette date de mise en service du projet devrait être celle du projet`, async () => {
      const dateDeMiseEnService = new Date('2023-01-01')
      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        id: projetId,
      } as Project)

      const renseignerDateMiseEnService = makeRenseignerDateDeMiseEnService({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDateMiseEnService({
        projetId,
        dateDeMiseEnService,
      })

      expect(résultat.isOk()).toBe(true)
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: DateDeMiseEnServiceRenseignée.type,
          payload: expect.objectContaining({
            projetId,
            dateDeMiseEnService: dateDeMiseEnService.toISOString(),
          }),
        })
      )
    })
  })
})
