import { DomainEvent } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/modificationRequest/errors'
import { InfraNotAvailableError } from '@modules/shared'
import { ModificationRequest } from '@modules/modificationRequest'
import { UnwrapForTest } from '../../../../types'
import {
  fakeTransactionalRepo,
  makeFakeDemandeRecours,
} from '../../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../../shared'
import { makeAnnulerRejetRecours } from './annulerRejetRecours'
import { USER_ROLES } from '@modules/users'

describe(`Commande annulerRejetRecours`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  beforeEach(() => {
    publishToEventStore.mockClear()
  })

  describe(`Annulation impossible si l'utilisateur n'a pas le rôle 'admin' ou 'dgec-validateur'`, () => {
    const rolesNePouvantPasAnnulerUnRejetDeRecours = USER_ROLES.filter(
      (role) => !['admin', 'dgec-validateur'].includes(role)
    )

    for (const role of rolesNePouvantPasAnnulerUnRejetDeRecours) {
      describe(`Etant donné un utilisateur ayant le rôle ${role}`, () => {
        const user = UnwrapForTest(makeUser(makeFakeUser({ role })))
        const shouldUserAccessProject = jest.fn(async () => true)
        const modificationRequestRepo = fakeTransactionalRepo(
          makeFakeDemandeRecours() as ModificationRequest
        )

        it(`Lorsqu'il annule le rejet d'une demande de recours,
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
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
    }
  })

  describe(`Annulation impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un utilisateur admin n'ayant pas les droits sur le projet`, () => {
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
      const shouldUserAccessProject = jest.fn(async () => false)
      const modificationRequestRepo = fakeTransactionalRepo(
        makeFakeDemandeRecours() as ModificationRequest
      )

      it(`Lorsqu'il annule le rejet d'un recours,
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
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

  describe(`Annulation impossible si le statut de la demande n'est pas "refusée"`, () => {
    describe(`Etant donné un utilisateur admin ayant les droits sur le projet
      et une demande de délai en statut 'envoyée'`, () => {
      it(`Lorsque l'utilisateur exécute la commande,
      alors une erreur StatutRéponseIncompatibleAvecAnnulationError devrait être retournée`, async () => {
        const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
        const shouldUserAccessProject = jest.fn(async () => true)
        const modificationRequestRepo = fakeTransactionalRepo(
          makeFakeDemandeRecours({ status: 'envoyée' }) as ModificationRequest
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

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(StatutRéponseIncompatibleAvecAnnulationError)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Annuler le rejet d'une demande de recours`, () => {
    describe(`Annulation de la demande possible`, () => {
      describe(`Etant donné un utilisateur admin ou dgec-validateur ayant les droits sur le projet
      et une demande de délai en statut "refusée"`, () => {
        it(`Lorsque l'utilisateur annule le rejet de la demande de délai,
        alors un événement RejetRecoursAnnulé devrait être émis`, async () => {
          const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin', id: 'user-id' })))
          const shouldUserAccessProject = jest.fn(async () => true)
          const projectId = 'id-du-projet'
          const demandeRecoursId = 'id-de-la-demande'
          const modificationRequestRepo = fakeTransactionalRepo(
            makeFakeDemandeRecours({ status: 'rejetée', projectId }) as ModificationRequest
          )
          const annulerRejetRecours = makeAnnulerRejetRecours({
            shouldUserAccessProject,
            modificationRequestRepo,
            publishToEventStore,
          })

          await annulerRejetRecours({
            user,
            demandeRecoursId,
          })

          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'RejetRecoursAnnulé',
              payload: expect.objectContaining({
                demandeRecoursId,
                annuléPar: 'user-id',
                projetId: projectId,
              }),
            })
          )
        })
      })
    })
  })
})
