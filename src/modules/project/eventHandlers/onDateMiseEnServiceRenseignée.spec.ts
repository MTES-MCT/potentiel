import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { DateMiseEnServiceRenseignée } from '../events'
import { makeOnDateMiseEnServiceRenseignée } from './onDateMiseEnServiceRenseignée'
import { DomainEvent } from '@core/domain'
import { CahierDesChargesModifié, ProjectAppelOffre } from '@entities'
import { Project } from '../Project'

describe(`Handler onDateMiseEnServiceRenseignée`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  beforeEach(() => publishToEventStore.mockClear())

  const dateAchèvementInitiale = new Date('2024-01-01').getTime()

  const nouvelleDateAchèvementAttendue = new Date(
    new Date(dateAchèvementInitiale).setMonth(new Date(dateAchèvementInitiale).getMonth() + 18)
  )
  const fakeProject = makeFakeProject()

  const projectRepo = fakeTransactionalRepo(fakeProject as Project)

  describe(`Projets non pouvant pas bénéficier du délai de 18 mois`, () => {
    describe(`Dates hors limites`, () => {
      describe(`Projets PV`, () => {
        for (const type of ['batiment', 'innovation', 'sol', 'zni', 'autre']) {
          const getProjectAppelOffre = jest.fn(
            () =>
              ({
                type,
                cahiersDesChargesModifiésDisponibles: [
                  {
                    type: 'modifié',
                    paruLe: '30/08/2022',
                    délaiCDC2022: {
                      délaiApplicableEnMois: 18,
                      datesLimitesMeS: { min: '2022-09-01', max: '2024-12-31' },
                    },
                  } as CahierDesChargesModifié,
                ] as ReadonlyArray<CahierDesChargesModifié>,
              } as ProjectAppelOffre)
          )
          it(`Etant donné un projet PV ${type} dont la date de mise en service est supérieure au 31 décembre 2024
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
            const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
              projectRepo,
              publishToEventStore,
              getProjectAppelOffre,
            })

            const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
              payload: { projetId: fakeProject.id.toString(), dateMiseEnService: '31/12/2025' },
            })

            await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
            expect(publishToEventStore).not.toHaveBeenCalled()
          })

          it(`Etant donné un projet PV ${type} dont la date de mise en service est inférieure au 1er septembre 2022,
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
            const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
              projectRepo,
              publishToEventStore,
              getProjectAppelOffre,
            })

            const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
              payload: { projetId: fakeProject.id.toString(), dateMiseEnService: '01/08/2022' },
            })

            await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
            expect(publishToEventStore).not.toHaveBeenCalled()
          })
        }
      })
      describe(`Projets éolien`, () => {
        const getProjectAppelOffre = jest.fn(
          () =>
            ({
              type: 'eolien',
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  délaiCDC2022: {
                    délaiApplicableEnMois: 18,
                    datesLimitesMeS: { min: '2022-06-01', max: '2024-09-30' },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as ProjectAppelOffre)
        )
        it(`Etant donné un projet éolien dont la date de mise en service est antérieure au 1er juin 2022
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
          const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
            projectRepo,
            publishToEventStore,
            getProjectAppelOffre,
          })

          const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
            payload: { projetId: fakeProject.id.toString(), dateMiseEnService: '01/05/2022' },
          })

          await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })

        it(`Etant donné un projet éolien dont la date de mise en service est postérieure au 30 septembre 2024
      alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
          const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
            projectRepo,
            publishToEventStore,
            getProjectAppelOffre,
          })

          const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
            payload: { projetId: fakeProject.id.toString(), dateMiseEnService: '30/10/2024' },
          })

          await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      })
    })

    describe(`Cahier des charges 2022 non souscrit`, () => {
      it(`Etant donné un projet éolien
         dont la date de mise en service est comprise entre le 1er juin 2022 et le 30 septembre 2024,
         MAIS qui n'a pas souscrit au CDC 2022,
         alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
        const getProjectAppelOffre = jest.fn(
          () =>
            ({
              type: 'eolien',
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  délaiCDC2022: {
                    délaiApplicableEnMois: 18,
                    datesLimitesMeS: { min: '2022-06-01', max: '2024-09-30' },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as ProjectAppelOffre)
        )
        const fakeProject = {
          ...makeFakeProject(),
          cahierDesCharges: { type: 'modifié', paruLe: '30/07/2022' },
        }
        const projectRepo = fakeTransactionalRepo(fakeProject as Project)
        const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
        })
        const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
          payload: { projetId: fakeProject.id.toString(), dateMiseEnService: '01/01/2023' },
        })
        await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    })

    describe(`Délai déjà appliqué`, () => {
      it(`Etant donné un projet éolien
         dont la date de mise en service est comprise entre le 1er juin 2022 et le 30 septembre 2024,
         qui a souscrit au CDC 2022,
         MAIS qui a déjà bénéficié du délai de 18 mois,
         alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
        const getProjectAppelOffre = jest.fn(
          () =>
            ({
              type: 'eolien',
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  délaiCDC2022: {
                    délaiApplicableEnMois: 18,
                    datesLimitesMeS: { min: '2022-06-01', max: '2024-09-30' },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as ProjectAppelOffre)
        )
        const fakeProject = {
          ...makeFakeProject(),
          cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
          délaiCDC2022appliqué: true,
        }
        const projectRepo = fakeTransactionalRepo(fakeProject as Project)
        const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
        })
        const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
          payload: { projetId: fakeProject.id.toString(), dateMiseEnService: '01/01/2023' },
        })
        await onDateMiseEnServiceRenseignée(événementMeSRenseignée)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Projet pouvant bénéficier du délai de 18 mois`, () => {
    it(`Etant donné un projet éolien,
      dont la date de mise en service est comprise entre le 1er juin 2022 et le 30 septembre 2024,
      ayant souscrit au CDC 2022,
      n'ayant pas déjà bénéficié du délai,
      alors le délai de 18 mois en lien avec le CDC 2022 devrait être appliqué`, async () => {
      const getProjectAppelOffre = jest.fn(
        () =>
          ({
            type: 'eolien',
            cahiersDesChargesModifiésDisponibles: [
              {
                type: 'modifié',
                paruLe: '30/08/2022',
                délaiCDC2022: {
                  délaiApplicableEnMois: 18,
                  datesLimitesMeS: { min: '2022-06-01', max: '2024-09-30' },
                },
              } as CahierDesChargesModifié,
            ] as ReadonlyArray<CahierDesChargesModifié>,
          } as ProjectAppelOffre)
      )
      const fakeProject = {
        ...makeFakeProject(),
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        completionDueOn: dateAchèvementInitiale,
        délaiCDC2022Appliqué: false,
      }
      const projectRepo = fakeTransactionalRepo(fakeProject as Project)

      const onDateMiseEnServiceRenseignée = makeOnDateMiseEnServiceRenseignée({
        projectRepo,
        publishToEventStore,
        getProjectAppelOffre,
      })

      const événementMeSRenseignée = new DateMiseEnServiceRenseignée({
        payload: { projetId: fakeProject.id.toString(), dateMiseEnService: '01/01/2023' },
      })

      await onDateMiseEnServiceRenseignée(événementMeSRenseignée)

      expect(publishToEventStore).toHaveBeenCalledTimes(1)
      const évènement = publishToEventStore.mock.calls[0][0]
      expect(évènement.type).toEqual('ProjectCompletionDueDateSet')
      expect(évènement.payload).toEqual(
        expect.objectContaining({
          projectId: fakeProject.id.toString(),
          completionDueOn: nouvelleDateAchèvementAttendue.getTime(),
          reason: 'délaiCdc2022',
        })
      )
    })
  })
})
