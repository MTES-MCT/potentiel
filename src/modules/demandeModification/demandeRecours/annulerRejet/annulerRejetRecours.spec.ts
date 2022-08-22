import { DomainEvent } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/modificationRequest/errors'
import { InfraNotAvailableError } from '@modules/shared'
import { ModificationRequest } from '@modules/modificationRequest'
import { UnwrapForTest } from '../../../../types'
import {
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
  makeFakeDemandeRecours,
  makeFakeModificationRequest,
} from '../../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../../shared'
import { makeAnnulerRejetRecours } from './annulerRejetRecours'

describe(`Commande annulerRejetRecours`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  beforeEach(() => {
    publishToEventStore.mockClear()
  })
  describe(`Annulation impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un utilisateur dreal n'ayant pas les droits sur le projet`, () => {
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
      const shouldUserAccessProject = jest.fn(async () => false)

      it(`Lorsqu'il annule le rejet d'un recours,
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
        const modificationRequestRepo = fakeTransactionalRepo(
          makeFakeModificationRequest() as ModificationRequest
        )

        const annulerRejetRecours = makeAnnulerRejetRecours({
          shouldUserAccessProject,
          modificationRequestRepo,
          publishToEventStore,
        })

        const res = await annulerRejetRecours({
          user,
          demandeRecoursId: 'id-de-la-demande',
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    })
  })

  // describe(`Annulation impossible si le statut de la demande n'est pas "refusée" ou "accordée"`, () => {
  //   describe(`Etant donné un utilisateur admin ayant les droits sur le projet
  //     et une demande de délai en statut 'envoyée'`, () => {
  //     it(`Lorsque l'utilisateur exécute la commande,
  //     alors une erreur StatutRéponseIncompatibleAvecAnnulationError devrait être retournée`, async () => {
  //       const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  //       const shouldUserAccessProject = jest.fn(async () => true)

  //       const demandeDélaiRepo = fakeTransactionalRepo(
  //         makeFakeDemandeDélai({ projetId: 'id-du-projet', statut: 'envoyée' })
  //       )

  //       const annulerRéponseDemandéDélai = makeAnnulerRejetDélai({
  //         shouldUserAccessProject,
  //         demandeDélaiRepo,
  //         publishToEventStore,
  //       })

  //       const res = await annulerRéponseDemandéDélai({
  //         user,
  //         demandeDélaiId: 'id-de-la-demande',
  //       })

  //       expect(res._unsafeUnwrapErr()).toBeInstanceOf(StatutRéponseIncompatibleAvecAnnulationError)
  //       expect(publishToEventStore).not.toHaveBeenCalled()
  //     })
  //   })
  // })

  // describe(`Annuler le rejet d'une demande de délai`, () => {
  //   describe(`Annulation de la demande possible`, () => {
  //     describe(`Etant donné un utilisateur admin ayant les droits sur le projet
  //     et une demande de délai en statut "refusée"`, () => {
  //       it(`Lorsque l'utilisateur annule le rejet de la demande de délai,
  //       alors un événement RejetDélaiAnnulé devrait être émis`, async () => {
  //         const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin', id: 'user-id' })))
  //         const shouldUserAccessProject = jest.fn(async () => true)

  //         const demandeDélaiRepo = fakeTransactionalRepo(
  //           makeFakeDemandeDélai({ projetId: 'id-du-projet', statut: 'refusée', id: 'id-demande' })
  //         )

  //         const annulerRejetDélai = makeAnnulerRejetDélai({
  //           shouldUserAccessProject,
  //           demandeDélaiRepo,
  //           publishToEventStore,
  //         })

  //         await annulerRejetDélai({
  //           user,
  //           demandeDélaiId: 'id-demande',
  //         })

  //         expect(publishToEventStore).toHaveBeenCalledWith(
  //           expect.objectContaining({
  //             type: 'RejetDélaiAnnulé',
  //             payload: expect.objectContaining({
  //               demandeDélaiId: 'id-demande',
  //               annuléPar: 'user-id',
  //               projetId: 'id-du-projet',
  //             }),
  //           })
  //         )
  //       })
  //     })
  //   })
  // })
})
