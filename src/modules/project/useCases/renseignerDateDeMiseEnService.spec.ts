import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { DateDeMiseEnServicePlusRécenteError } from '../errors'
import { Project } from '../Project'
import { makeRenseignerDateDeMiseEnService } from './renseignerDateDeMiseEnService'

describe('Renseigner une date de mise en service', () => {
  const projetId = new UniqueEntityID().toString()
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const projectRepo = fakeRepo({
    ...makeFakeProject(),
    id: projetId,
    dateMiseEnService: new Date('2023-01-01'),
  } as Project)

  describe(`Impossible de renseigner la date de mise en service si le projet dispose d'une date de mise en service plus récente que celle à renseigner`, () => {
    it(`Étant donné un projet avec une date de mise en service existante au '2023-01-01
        Lorsqu'on renseigne une nouvelle date de mise en service pour ce projet au '2022-01-01'
        Alors la date de mise en service n'est pas remplacée et une erreur de type 'DateDeMiseEnServicePlusRécenteError' est retournée
        Et aucun évènement ne devrait être émis`, async () => {
      const renseignerDateMiseEnService = makeRenseignerDateDeMiseEnService({
        publishToEventStore,
        projectRepo,
      })

      const résultat = await renseignerDateMiseEnService({
        projetId,
        dateMiseEnService: new Date('2022-01-01'),
      })

      expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(DateDeMiseEnServicePlusRécenteError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })
})
