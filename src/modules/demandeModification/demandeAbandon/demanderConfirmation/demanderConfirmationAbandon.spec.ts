import { Readable } from 'stream'
import { okAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { UserRole } from '@modules/users'
import { User } from '@entities'

import { makeFakeDemandeAbandon } from '../../../../__tests__/fixtures/aggregates/makeFakeDemandeAbandon'
import { makeDemanderConfirmationAbandon } from './demanderConfirmationAbandon'
import { StatutDemandeAbandon } from '../DemandeAbandon'
import { DemanderConfirmationAbandonError } from './DemanderConfirmationAbandonError'

describe(`Demander une confirmation d'abandon`, () => {
  const demandeAbandonId = 'id-demande'
  const fichierRéponse = {
    contents: Readable.from('test-content'),
    filename: 'fichier-réponse',
  }

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible de demander une confirmation d'abandon si non Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur autre que Admin, DGEC ou DREAL`, () => {
      const rolesNePouvantPasAccorderUneDemandeAbandon: UserRole[] = [
        'acheteur-obligé',
        'ademe',
        'porteur-projet',
      ]

      for (const role of rolesNePouvantPasAccorderUneDemandeAbandon) {
        const user = { role } as User

        it(`
        Lorsqu'il demande une confirmation d'abandon
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          const demandeAbandon = makeFakeDemandeAbandon({ projetId: 'le-projet' })
          const demanderConfirmationAbandon = makeDemanderConfirmationAbandon({
            demandeAbandonRepo: {
              ...fakeTransactionalRepo(demandeAbandon),
              ...fakeRepo(demandeAbandon),
            },
            publishToEventStore,
            fileRepo: fakeRepo(),
          })

          const res = await demanderConfirmationAbandon({
            user,
            demandeAbandonId,
            fichierRéponse,
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Impossible de demander une confirmation avec un statut 'en attente de confirmation' ou 'demande confirmée'`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User
      for (const statut of ['en attente de confirmation', 'demande confirmée']) {
        it(`
            Lorsqu'il accorde une demande d'abandon avec comme statut '${statut}'
            Alors une erreur AccorderDemandeAbandonError devrait être retournée
            Et aucun évènement ne devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()

          const demandeAbandon = makeFakeDemandeAbandon({
            id: demandeAbandonId,
            statut: statut as StatutDemandeAbandon,
            projetId: 'le-projet',
          })
          const demanderConfirmationAbandon = makeDemanderConfirmationAbandon({
            demandeAbandonRepo: {
              ...fakeTransactionalRepo(demandeAbandon),
              ...fakeRepo(demandeAbandon),
            },
            publishToEventStore,
            fileRepo,
          })

          const res = await demanderConfirmationAbandon({
            user,
            demandeAbandonId,
            fichierRéponse,
          })

          const erreurActuelle = res._unsafeUnwrapErr()
          expect(erreurActuelle).toBeInstanceOf(DemanderConfirmationAbandonError)
          expect(publishToEventStore).not.toHaveBeenCalled()
          expect(fileRepo.save).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Possible de demander une confirmation d'abandon avec le statut 
            'envoyée' ou 'en-instruction' et le role admin`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User

      for (const statut of ['envoyée', 'en-instruction']) {
        it(`
            Lorsqu'il accorde une demande de confirmation d'abandon avec comme statut '${statut}'
            Alors le courrier de réponse devrait être sauvegardé
            Et l'évenement 'ConfirmationAbandonDemandée' devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()

          const demandeAbandon = makeFakeDemandeAbandon({
            id: demandeAbandonId,
            statut: statut as StatutDemandeAbandon,
            projetId: 'le-projet-de-la-demande',
          })

          const demanderConfirmationAbandon = makeDemanderConfirmationAbandon({
            demandeAbandonRepo: {
              ...fakeTransactionalRepo(demandeAbandon),
              ...fakeRepo(demandeAbandon),
            },
            publishToEventStore,
            fileRepo,
          })

          const resultat = await demanderConfirmationAbandon({
            user,
            demandeAbandonId,
            fichierRéponse,
          })

          expect(resultat.isOk()).toBe(true)
          expect(fileRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
              designation: 'modification-request-response',
              forProject: { value: 'le-projet-de-la-demande' },
              filename: fichierRéponse.filename,
              path: 'projects/le-projet-de-la-demande/fichier-réponse',
            })
          )
          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'ConfirmationAbandonDemandée',
              payload: expect.objectContaining({
                projetId: 'le-projet-de-la-demande',
                demandéePar: user.id,
                demandeAbandonId,
                fichierRéponseId: expect.any(String),
              }),
            })
          )
        })
      }
    })
  })
})
