import { okAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { USER_ROLES, UserRole } from '@modules/users'
import { User } from '@entities'
import { makeFakeDemandeAbandon } from '../../../../__tests__/fixtures/aggregates/makeFakeDemandeAbandon'
import { makeConfirmerDemandeAbandon } from './confirmerDemandeAbandon'
import { ConfirmerDemandeAbandonError } from './ConfirmerDemandeAbandonError'

describe(`Confirmer une demande d'abandon`, () => {
  const demandeAbandonId = 'id-demande'
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible de confirmer un abandon si non porteur-projet`, () => {
    describe(`Etant donné un utilisateur autre que porteur-projet`, () => {
      const rolesNePouvantConfirmerUneDemandeAbandon: UserRole[] = USER_ROLES.filter(
        (role) => role !== 'porteur-projet'
      )

      for (const role of rolesNePouvantConfirmerUneDemandeAbandon) {
        const confirméPar = { role } as User

        it(`
        Lorsque l'utilisateur est ${role} et qu'il confirme une demande d'abandon.
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          const demandeAbandon = makeFakeDemandeAbandon({ projetId: 'le-projet' })
          const confirmerDemandeAbandon = makeConfirmerDemandeAbandon({
            demandeAbandonRepo: {
              ...fakeTransactionalRepo(demandeAbandon),
              ...fakeRepo(demandeAbandon),
            },
            publishToEventStore,
            aAccèsAuProjet: async () => true,
          })

          const res = await confirmerDemandeAbandon({
            confirméPar,
            demandeAbandonId,
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Impossible de confirmer une demande d'abandon si un user n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un porteur de projet qui n'a pas les droits sur le projet`, () => {
      const confirméPar = { role: 'porteur-projet' } as User
      it(`
        Lorsque qu'il confirme une demande d'abandon.
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
        const demandeAbandon = makeFakeDemandeAbandon({ projetId: 'le-projet' })
        const confirmerDemandeAbandon = makeConfirmerDemandeAbandon({
          demandeAbandonRepo: fakeTransactionalRepo(demandeAbandon),
          publishToEventStore,
          aAccèsAuProjet: async () => false,
        })

        const res = await confirmerDemandeAbandon({ confirméPar, demandeAbandonId })
        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Impossible de confirmer avec un statut autre que 'en attente de confirmation'`, () => {
    describe(`Etant donné un utilisateur porteur-projet`, () => {
      const confirméPar = { role: 'porteur-projet' } as User
      it(`
            Lorsqu'il confirme une demande d'abandon avec comme statut 'envoyée'
            Alors une erreur ConfirmerDemandeAbandonError devrait être retournée
            Et aucun évènement ne devrait être publié dans le store`, async () => {
        const demandeAbandon = makeFakeDemandeAbandon({
          id: demandeAbandonId,
          statut: 'envoyée',
          projetId: 'le-projet',
        })

        const confirmerDemandeAbandon = makeConfirmerDemandeAbandon({
          demandeAbandonRepo: fakeTransactionalRepo(demandeAbandon),
          publishToEventStore,
          aAccèsAuProjet: async () => true,
        })

        const res = await confirmerDemandeAbandon({ confirméPar, demandeAbandonId })
        const erreurActuelle = res._unsafeUnwrapErr()
        expect(erreurActuelle).toBeInstanceOf(ConfirmerDemandeAbandonError)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Possible de confirmer un abandon`, () => {
    describe(`Etant donné un utilisateur qui a les droits sur le projet`, () => {
      const confirméPar = { role: 'porteur-projet' } as User

      it(`
           Lorsqu'il accorde confirme une demande d'abandon en attente de confirmation
           alors l'évenement 'AbandonConfirmé' devrait être publié dans le store`, async () => {
        const demandeAbandon = makeFakeDemandeAbandon({
          id: demandeAbandonId,
          statut: 'en attente de confirmation',
          projetId: 'le-projet-de-la-demande',
        })

        const confirmerDemandeAbandon = makeConfirmerDemandeAbandon({
          demandeAbandonRepo: fakeTransactionalRepo(demandeAbandon),
          publishToEventStore,
          aAccèsAuProjet: async () => true,
        })

        const resultat = await confirmerDemandeAbandon({ confirméPar, demandeAbandonId })

        expect(resultat.isOk()).toBe(true)
        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'AbandonConfirmé',
            payload: expect.objectContaining({
              projetId: 'le-projet-de-la-demande',
              confirméPar: confirméPar.id,
              demandeAbandonId,
            }),
          })
        )
      })
    })
  })
})
