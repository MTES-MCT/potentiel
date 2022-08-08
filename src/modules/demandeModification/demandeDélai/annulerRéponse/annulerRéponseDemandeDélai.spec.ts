import { DomainEvent } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/modificationRequest/errors'
import { InfraNotAvailableError } from '@modules/shared'
import { UnwrapForTest } from '../../../../types'
import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../../shared'
import { makeAnnulerRéponseDemandeDélai } from './annulerRéponseDemandeDélai'

describe(`Commande annulerRéponseDemandeDélai`, () => {
  const projectRepo = fakeRepo(makeFakeProject())
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  beforeEach(() => {
    publishToEventStore.mockClear()
  })
  describe(`Annuler une réponse - cas génériques`, () => {
    describe(`Annulation impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
      describe(`Etant donné un utilisateur dreal n'ayant pas les droits sur le projet`, () => {
        const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
        const shouldUserAccessProject = jest.fn(async () => false)
        it(`Lorsqu'il annule le rejet d'une demande de délai,
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
          const demandeDélaiRepo = fakeTransactionalRepo(
            makeFakeDemandeDélai({ projetId: 'id-du-projet' })
          )

          const annulerRéponseDemandéDélai = makeAnnulerRéponseDemandeDélai({
            shouldUserAccessProject,
            demandeDélaiRepo,
            publishToEventStore,
            projectRepo,
          })

          const res = await annulerRéponseDemandéDélai({
            user,
            demandeDélaiId: 'id-de-la-demande',
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      })
    })

    describe(`Annulation impossible si le statut de la demande n'est pas "refusée" ou "accordée"`, () => {
      describe(`Etant donné un utilisateur admin ayant les droits sur le projet
      et une demande de délai en statut 'envoyée'`, () => {
        it(`Lorsque l'utilisateur exécute la commande, 
      alors une erreur StatutRéponseIncompatibleAvecAnnulationError devrait être retournée`, async () => {
          const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dgec' })))
          const shouldUserAccessProject = jest.fn(async () => true)

          const demandeDélaiRepo = fakeTransactionalRepo(
            makeFakeDemandeDélai({ projetId: 'id-du-projet', statut: 'envoyée' })
          )

          const annulerRéponseDemandéDélai = makeAnnulerRéponseDemandeDélai({
            shouldUserAccessProject,
            demandeDélaiRepo,
            publishToEventStore,
            projectRepo,
          })

          const res = await annulerRéponseDemandéDélai({
            user,
            demandeDélaiId: 'id-de-la-demande',
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(
            StatutRéponseIncompatibleAvecAnnulationError
          )
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe(`Annuler le rejet d'une demande de délai`, () => {
    describe(`Annulation de la demande possible`, () => {
      describe(`Etant donné un utilisateur admin ayant les droits sur le projet
      et une demande de délai en statut "refusée"`, () => {
        it(`Lorsque l'utilisateur annule le rejet de la demande de délai,
        alors un événement RejetDemandeDélaiAnnulé devrait être émis`, async () => {
          const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dgec', id: 'user-id' })))
          const shouldUserAccessProject = jest.fn(async () => true)

          const demandeDélaiRepo = fakeTransactionalRepo(
            makeFakeDemandeDélai({ projetId: 'id-du-projet', statut: 'refusée', id: 'id-demande' })
          )

          const annulerRéponseDemandéDélai = makeAnnulerRéponseDemandeDélai({
            shouldUserAccessProject,
            demandeDélaiRepo,
            publishToEventStore,
            projectRepo,
          })

          await annulerRéponseDemandéDélai({
            user,
            demandeDélaiId: 'id-demande',
          })

          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'RejetDemandeDélaiAnnulé',
              payload: expect.objectContaining({
                demandeDélaiId: 'id-demande',
                annuléPar: 'user-id',
                projetId: 'id-du-projet',
              }),
            })
          )
        })
      })
    })
  })

  describe(`Annuler l'accord suite à une demande de délai`, () => {
    describe(`Annulation de la demande possible`, () => {
      describe(`Etant donné un utilisateur admin ayant les droits sur le projet
      et une demande de délai en statut "accordée" de type DemandeDélai`, () => {
        it(`Lorsque l'utilisateur annule le l'accord suite à la demande de délai,
        alors un événement AccordDemandeDélaiAnnulé devrait être émis avec la nouvelle date d'achèvement`, async () => {
          const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dgec', id: 'user-id' })))
          const shouldUserAccessProject = jest.fn(async () => true)

          const ancienneDateThéoriqueAchèvement = new Date('2024-01-01').toISOString()
          const dateAchèvementAccordée = new Date('2024-01-10').toISOString() // 9 jours de délai

          const projectRepo = fakeRepo(
            makeFakeProject({ completionDueOn: new Date('2025-01-19').getTime() })
          )

          const demandeDélaiRepo = fakeTransactionalRepo(
            makeFakeDemandeDélai({
              projetId: 'id-du-projet',
              statut: 'accordée',
              id: 'id-demande',
              ancienneDateThéoriqueAchèvement,
              dateAchèvementAccordée,
            })
          )

          const annulerRéponseDemandéDélai = makeAnnulerRéponseDemandeDélai({
            shouldUserAccessProject,
            demandeDélaiRepo,
            publishToEventStore,
            projectRepo,
          })

          await annulerRéponseDemandéDélai({
            user,
            demandeDélaiId: 'id-demande',
          })

          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'AccordDemandeDélaiAnnulé',
              payload: expect.objectContaining({
                demandeDélaiId: 'id-demande',
                annuléPar: 'user-id',
                projetId: 'id-du-projet',
                nouvelleDateAchèvement: new Date('2025-01-10').toISOString(), // completionDueOn - 9 jours
              }),
            })
          )
        })
      })

      describe(`Etant donné un utilisateur admin ayant les droits sur le projet
      et une demande de délai en statut "accordée" de type ModificationRequestAccepted`, () => {
        it(`Lorsque l'utilisateur annule le l'accord suite à la demande de délai,
        alors un événement AccordDemandeDélaiAnnulé devrait être émis avec la nouvelle date d'achèvement`, async () => {
          const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dgec', id: 'user-id' })))
          const shouldUserAccessProject = jest.fn(async () => true)

          const completionDueOn = new Date('2022-02-01').getTime()
          const projectRepo = fakeRepo(makeFakeProject({ completionDueOn }))

          const délaiEnMoisAccordé = 1

          const demandeDélaiRepo = fakeTransactionalRepo(
            makeFakeDemandeDélai({
              projetId: 'id-du-projet',
              statut: 'accordée',
              id: 'id-demande',
              délaiEnMoisAccordé,
            })
          )

          const annulerRéponseDemandéDélai = makeAnnulerRéponseDemandeDélai({
            shouldUserAccessProject,
            demandeDélaiRepo,
            publishToEventStore,
            projectRepo,
          })

          await annulerRéponseDemandéDélai({
            user,
            demandeDélaiId: 'id-demande',
          })

          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'AccordDemandeDélaiAnnulé',
              payload: expect.objectContaining({
                demandeDélaiId: 'id-demande',
                annuléPar: 'user-id',
                projetId: 'id-du-projet',
                nouvelleDateAchèvement: '2022-01-01T00:00:00.000Z', // completionDueOn - délaiAccordéEnMois
              }),
            })
          )
        })
      })
    })
  })
})
