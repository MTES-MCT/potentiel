import { Readable } from 'stream'
import { okAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { UserRole } from '@modules/users'
import { User } from '@entities'

import { makeAccorderDemandeAbandon } from './accorderDemandeAbandon'
import { makeFakeDemandeAbandon } from '../../../../__tests__/fixtures/aggregates/makeFakeDemandeAbandon'
import { AccorderDemandeAbandonError } from './AccorderDemandeAbandonError'
import { StatutDemandeAbandon } from '../DemandeAbandon'

describe(`Accorder une demande d'abandon`, () => {
  const demandeAbandonId = 'id-demande'
  const fichierRéponse = {
    contents: Readable.from('test-content'),
    filename: 'fichier-réponse',
  }

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible d'accorder un abandon si non Admin/DGEC`, () => {
    describe(`Etant donné un utilisateur autre que Admin ou DGEC`, () => {
      const rolesNePouvantPasAccorderUneDemandeAbandon: UserRole[] = [
        'acheteur-obligé',
        'ademe',
        'porteur-projet',
      ]

      for (const role of rolesNePouvantPasAccorderUneDemandeAbandon) {
        const user = { role } as User

        it(`
        Lorsqu'il accorde une demande d'abandon
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          const demandeAbandon = makeFakeDemandeAbandon({ projetId: 'le-projet' })
          const accorderDemandeAbandon = makeAccorderDemandeAbandon({
            demandeAbandonRepo: {
              ...fakeTransactionalRepo(demandeAbandon),
              ...fakeRepo(demandeAbandon),
            },
            publishToEventStore,
            fileRepo: fakeRepo(),
          })

          const res = await accorderDemandeAbandon({
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

  describe(`Impossible d'accorder une demande avec un statut autre que 'envoyée'`, () => {
    describe(`Etant donné un utilisateur Admin ou DGEC`, () => {
      const user = { role: 'admin' } as User

      const statutsNePouvantPasÊtreAccordé: StatutDemandeAbandon[] = [
        'accordée',
        'refusée',
        'annulée',
      ]

      for (const statut of statutsNePouvantPasÊtreAccordé) {
        it(`
      Lorsqu'il accorde une demande d'abandon avec comme statut '${statut}'
      Alors une erreur AccorderDemandeAbandonError devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()

          const demandeAbandon = makeFakeDemandeAbandon({
            id: demandeAbandonId,
            statut,
            projetId: 'le-projet',
          })
          const accorderDemandeAbandon = makeAccorderDemandeAbandon({
            demandeAbandonRepo: {
              ...fakeTransactionalRepo(demandeAbandon),
              ...fakeRepo(demandeAbandon),
            },
            publishToEventStore,
            fileRepo,
          })

          const res = await accorderDemandeAbandon({
            user,
            demandeAbandonId,
            fichierRéponse,
          })

          const erreurActuelle = res._unsafeUnwrapErr()
          expect(erreurActuelle).toBeInstanceOf(AccorderDemandeAbandonError)
          expect(publishToEventStore).not.toHaveBeenCalled()
          expect(fileRepo.save).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Accorder un abandon`, () => {
    describe(`Etant donné un utilisateur Admin ou DGEC`, () => {
      const user = { role: 'admin' } as User
      const statutsPouvantÊtreAccordé: StatutDemandeAbandon[] = ['envoyée', 'en-instruction']

      for (const statut of statutsPouvantÊtreAccordé) {
        it(`
      Lorsqu'il accorde une demande d'abandon avec comme statut '${statut}'
      Alors le courrier de réponse devrait être sauvegardé 
      Et l'évenement 'AbandonAccordé' devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()

          const demandeAbandon = makeFakeDemandeAbandon({
            id: demandeAbandonId,
            statut,
            projetId: 'le-projet-de-la-demande',
          })

          const accorderDemandeAbandon = makeAccorderDemandeAbandon({
            demandeAbandonRepo: {
              ...fakeTransactionalRepo(demandeAbandon),
              ...fakeRepo(demandeAbandon),
            },
            publishToEventStore,
            fileRepo,
          })

          const resultat = await accorderDemandeAbandon({
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
              type: 'AbandonAccordé',
              payload: expect.objectContaining({
                projetId: 'le-projet-de-la-demande',
                accordéPar: user.id,
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
