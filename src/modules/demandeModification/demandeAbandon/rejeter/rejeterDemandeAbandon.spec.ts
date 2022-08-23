import { Readable } from 'stream'

import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { User } from '@entities'
import { UserRole } from '@modules/users'
import { InfraNotAvailableError } from '@modules/shared'

import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { UnauthorizedError } from '../../../shared'
import { makeRejeterDemandeAbandon } from './rejeterDemandeAbandon'
import { makeFakeDemandeAbandon } from '../../../../__tests__/fixtures/aggregates/makeFakeDemandeAbandon'
import { StatutDemandeAbandon } from '../DemandeAbandon'
import { RejeterDemandeAbandonError } from './RejeterDemandeAbandonError'

describe(`Rejeter une demande d'abandon`, () => {
  const demandeAbandonId = 'id-demande'
  const fichierRéponse = { contents: Readable.from('test-content'), filename: 'fichier-réponse' }
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible de rejeter un abandon si non Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur autre que Admin, DGEC ou DREAL`, () => {
      const rolesNePouvantPasRefuser: UserRole[] = ['acheteur-obligé', 'ademe', 'porteur-projet']

      for (const role of rolesNePouvantPasRefuser) {
        const user = { role } as User

        it(`
        Lorsqu'il rejette une demande d'abandon
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          const rejeterDemandeAbandon = makeRejeterDemandeAbandon({
            demandeAbandonRepo: fakeTransactionalRepo(makeFakeDemandeAbandon()),
            publishToEventStore,
            fileRepo: fakeRepo(),
          })

          const res = await rejeterDemandeAbandon({
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

  describe(`Impossible de rejeter une demande avec un statut autre que 'envoyée' ou 'en-instruction'`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User

      const statutsNePouvantPasÊtreRefusé: StatutDemandeAbandon[] = [
        'accordée',
        'refusée',
        'annulée',
      ]

      for (const statut of statutsNePouvantPasÊtreRefusé) {
        it(`
      Lorsqu'il rejette une demande avec comme statut '${statut}'
      Alors une erreur RefuserDemandeAbandonError devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()
          const rejeterDemandeAbandon = makeRejeterDemandeAbandon({
            demandeAbandonRepo: fakeTransactionalRepo(
              makeFakeDemandeAbandon({ id: demandeAbandonId, statut })
            ),
            publishToEventStore,
            fileRepo,
          })

          const res = await rejeterDemandeAbandon({
            user,
            demandeAbandonId,
            fichierRéponse,
          })

          const erreurActuelle = res._unsafeUnwrapErr()
          expect(erreurActuelle).toBeInstanceOf(RejeterDemandeAbandonError)
          expect(publishToEventStore).not.toHaveBeenCalled()
          expect(fileRepo.save).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Possible de rejeter un abandon si Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin', id: 'user-id' } as User

      const statutsPouvantÊtreAccordé: StatutDemandeAbandon[] = ['envoyée', 'en-instruction']

      for (const statut of statutsPouvantÊtreAccordé) {
        it(`
      Lorsqu'il rejette une demande d'abandon avec comme statut '${statut}'
      Alors le courrier de réponse devrait être sauvegardé 
      Et l'évenement 'AbandonRejeté' devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()

          const projetId = 'le-projet-de-la-demande'

          const rejeterDemandeAbandon = makeRejeterDemandeAbandon({
            demandeAbandonRepo: fakeTransactionalRepo(
              makeFakeDemandeAbandon({
                id: demandeAbandonId,
                statut,
                projetId,
              })
            ),
            publishToEventStore,
            fileRepo,
          })

          const rejet = await rejeterDemandeAbandon({
            user,
            demandeAbandonId,
            fichierRéponse,
          })

          expect(rejet.isOk()).toBe(true)
          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'AbandonRejeté',
              payload: expect.objectContaining({
                demandeAbandonId,
                rejetéPar: user.id,
                fichierRéponseId: expect.any(String),
                projetId,
              }),
            })
          )

          expect(fileRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
              designation: 'modification-request-response',
              forProject: new UniqueEntityID(projetId),
              filename: fichierRéponse.filename,
              path: `projects/${projetId.toString()}/${fichierRéponse.filename}`,
            })
          )
        })
      }
    })
  })
})
