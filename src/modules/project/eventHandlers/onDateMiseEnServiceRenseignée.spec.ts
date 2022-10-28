import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import { DateMiseEnServiceRenseignée } from '../events'
import { makeOnDateMiseEnServiceRenseignée } from './onDateMiseEnServiceRenseignée'
import { DomainEvent } from '@core/domain'
import { ProjectAppelOffre } from '@entities'

describe(`Handler onDateMiseEnServiceRenseignée`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  beforeEach(() => publishToEventStore.mockClear())

  const dateAchèvementInitiale = new Date('2024-01-01').getTime()

  const nouvelleDateAchèvementAttendue = new Date(
    new Date(dateAchèvementInitiale).setMonth(new Date(dateAchèvementInitiale).getMonth() + 18)
  )

  for (const type of ['autoconso', 'batiment', 'innovation', 'neutre', 'sol', 'zni', 'autre']) {
    describe(`Projets PV ${type}`, () => {
      const getProjectAppelOffre = jest.fn(() => ({ type } as ProjectAppelOffre))
      describe(`Projet PV ${type} ne pouvant pas bénéficier du délai de 18 mois`, () => {
        it(`Etant donné un projet PV ${type} dont la date de mise en service est supérieure au 31 décembre 2024
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
          const projectRepo = fakeTransactionalRepo(
            makeFakeProject({
              id: 'projetId',
            })
          )

          const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
            projectRepo,
            publishToEventStore,
            getProjectAppelOffre,
          })

          const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
            payload: { projetId: 'projetId', dateMiseEnService: '01/01/2050' },
          })

          await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })

        it(`Etant donné un projet PV ${type} dont la date de mise en service est inférieure au 1er septembre 2022, 
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
          const projectRepo = fakeTransactionalRepo(
            makeFakeProject({
              id: 'projetId',
            })
          )

          const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
            projectRepo,
            publishToEventStore,
            getProjectAppelOffre,
          })

          const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
            payload: { projetId: 'projetId', dateMiseEnService: '01/01/2020' },
          })

          await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })

        it(`Etant donné un projet PV ${type} : 
      - dont la date de mise en service est comprise entre le 1er septembre 2022 et le 31 décembre 2024
      - MAIS n'ayant pas souscrit au CDC 2022
      alors le projet ne doit pas être modifié et aucun événement n'est émis
      `, async () => {
          const projectRepo = fakeTransactionalRepo(
            makeFakeProject({
              id: 'projetId',
              cahierDesCharges: { type: 'modifié', paruLe: '30/07/2022' },
            })
          )

          const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
            projectRepo,
            publishToEventStore,
            getProjectAppelOffre,
          })

          const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
            payload: { projetId: 'projetId', dateMiseEnService: '01/01/2023' },
          })

          await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })

        it(`Etant donné un projet PV ${type} : 
      - dont la date de mise en service est comprise entre le 1er septembre 2022 et le 31 décembre 2024
      - MAIS ayant déjà bénéficié du délai CDC 2022,
      alors le projet ne doit pas être modifié et aucun événement n'est émis
      `, async () => {
          const projectRepo = fakeTransactionalRepo(
            makeFakeProject({
              id: 'projetId',
              cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
              délaiCDC2022appliqué: true,
            })
          )

          const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
            projectRepo,
            publishToEventStore,
            getProjectAppelOffre,
          })

          const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
            payload: { projetId: 'projetId', dateMiseEnService: '01/01/2023' },
          })

          await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      })

      describe(`Projet PV ${type} pouvant bénéficier du délai de 18 mois`, () => {
        it(`Etant donné un projet PV ${type} : 
      - ayant souscrit au CDC 2022,
      - dont la date de mise en service est comprise entre le 1er septembre 2022 et le 31 décembre 2024,
      alors le délai de 18 mois en lien avec le CDC 2022 devrait être appliqué`, async () => {
          const projectRepo = fakeTransactionalRepo(
            makeFakeProject({
              id: 'projetId',
              cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
              completionDueOn: dateAchèvementInitiale,
            })
          )

          const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
            projectRepo,
            publishToEventStore,
            getProjectAppelOffre,
          })

          const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
            payload: { projetId: 'projetId', dateMiseEnService: '01/01/2023' },
          })

          await onDateMiseEnServiceRenseignée(événementMeSRenseignée)

          expect(publishToEventStore).toHaveBeenCalledTimes(2)
          const évènement1 = publishToEventStore.mock.calls[0][0]
          expect(évènement1.type).toEqual('ProjectCompletionDueDateSet')
          expect(évènement1.payload).toEqual(
            expect.objectContaining({
              projectId: 'projetId',
              completionDueOn: nouvelleDateAchèvementAttendue.getTime(),
            })
          )

          const évènement2 = publishToEventStore.mock.calls[1][0]
          expect(évènement2.type).toEqual('DélaiCDC2022Appliqué')
          expect(évènement2.payload).toEqual(
            expect.objectContaining({
              projetId: 'projetId',
              nouvelleDateLimiteAchèvement: nouvelleDateAchèvementAttendue.toISOString(),
              ancienneDateLimiteAchèvement: new Date(dateAchèvementInitiale).toISOString(),
            })
          )
        })
      })
    })
  }

  describe(`Projets éolien`, () => {
    const getProjectAppelOffre = jest.fn(() => ({ type: 'eolien' } as ProjectAppelOffre))
    describe(`Projet éolien ne pouvant pas bénéficier du délai de 18 mois`, () => {
      it(`Etant donné un projet éolien dont la date de mise en service est antérieure au 1er juin 2022
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
        const projectRepo = fakeTransactionalRepo(
          makeFakeProject({
            id: 'projetId',
          })
        )

        const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
        })

        const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
          payload: { projetId: 'projetId', dateMiseEnService: '01/01/2021' },
        })

        await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })

      it(`Etant donné un projet éolien dont la date de mise en service est postérieure au 30 septembre 2024
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
        const projectRepo = fakeTransactionalRepo(
          makeFakeProject({
            id: 'projetId',
          })
        )

        const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
        })

        const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
          payload: { projetId: 'projetId', dateMiseEnService: '01/01/2050' },
        })

        await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })

      it(`Etant donné un projet éolien 
      dont la date de mise en service est comprise entre le 1er juin 2022 et le 30 septembre 2024,
      MAIS qui n'a pas souscrit au CDC 2022,
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
        const projectRepo = fakeTransactionalRepo(
          makeFakeProject({
            id: 'projetId',
            cahierDesCharges: { type: 'modifié', paruLe: '30/07/2022' },
          })
        )

        const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
        })

        const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
          payload: { projetId: 'projetId', dateMiseEnService: '01/01/2023' },
        })

        await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    })

    describe(`Projet éolien pouvant bénéficier du délai de 18 mois`, () => {
      it(`dont la date de mise en service est comprise entre le 1er juin 2022 et le 30 septembre 2024,
      et ayant souscrit au CDC 2022, 
      alors le délai de 18 mois en lien avec le CDC 2022 devrait être appliqué`, async () => {
        const projectRepo = fakeTransactionalRepo(
          makeFakeProject({
            id: 'projetId',
            cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
            completionDueOn: dateAchèvementInitiale,
          })
        )

        const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
        })

        const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
          payload: { projetId: 'projetId', dateMiseEnService: '01/01/2023' },
        })

        await onDateMiseEnServiceRenseignée(événementMeSRenseignée)

        expect(publishToEventStore).toHaveBeenCalledTimes(2)
        const évènement1 = publishToEventStore.mock.calls[0][0]
        expect(évènement1.type).toEqual('ProjectCompletionDueDateSet')
        expect(évènement1.payload).toEqual(
          expect.objectContaining({
            projectId: 'projetId',
            completionDueOn: nouvelleDateAchèvementAttendue.getTime(),
          })
        )

        const évènement2 = publishToEventStore.mock.calls[1][0]
        expect(évènement2.type).toEqual('DélaiCDC2022Appliqué')
        expect(évènement2.payload).toEqual(
          expect.objectContaining({
            projetId: 'projetId',
            nouvelleDateLimiteAchèvement: nouvelleDateAchèvementAttendue.toISOString(),
            ancienneDateLimiteAchèvement: new Date(dateAchèvementInitiale).toISOString(),
          })
        )
      })
    })
  })
})
