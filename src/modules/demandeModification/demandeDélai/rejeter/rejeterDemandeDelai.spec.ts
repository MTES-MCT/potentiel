import { Readable } from 'stream'

import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { User } from '@entities'
import { UserRole } from '@modules/users'
import { InfraNotAvailableError } from '@modules/shared'

import { StatutDemandeDélai } from '../DemandeDélai'
import { makeRejeterDemandeDélai } from './rejeterDemandeDélai'
import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates'
import { UnauthorizedError } from '../../../shared'
import { RejeterDemandeDélaiError } from './RejeterDemandeDélaiError'

describe(`Rejeter une demande de délai`, () => {
  const demandeDélaiId = 'id-demande'
  const fichierRéponse = {
    contents: Readable.from('test-content'),
    filename: 'fichier-réponse',
  }
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible de rejeter un délai si non Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur autre que Admin, DGEC ou DREAL`, () => {
      const rolesNePouvantPasRefuser: UserRole[] = ['acheteur-obligé', 'ademe', 'porteur-projet']

      for (const role of rolesNePouvantPasRefuser) {
        const user = { role } as User

        it(`
        Lorsqu'il rejette une demande de délai
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          const rejeterDemandéDélai = makeRejeterDemandeDélai({
            demandeDélaiRepo: fakeTransactionalRepo(makeFakeDemandeDélai()),
            publishToEventStore,
            fileRepo: fakeRepo(),
          })

          const res = await rejeterDemandéDélai({
            user,
            demandeDélaiId,
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

      const statutsNePouvantPasÊtreRefusé: StatutDemandeDélai[] = ['accordée', 'refusée', 'annulée']

      for (const statut of statutsNePouvantPasÊtreRefusé) {
        it(`
      Lorsqu'il rejette une demande avec comme statut '${statut}'
      Alors une erreur RefuserDemandeDélaiError devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()
          const rejeterDemandéDélai = makeRejeterDemandeDélai({
            demandeDélaiRepo: fakeTransactionalRepo(
              makeFakeDemandeDélai({ id: demandeDélaiId, statut })
            ),
            publishToEventStore,
            fileRepo,
          })

          const res = await rejeterDemandéDélai({
            user,
            demandeDélaiId,
            fichierRéponse,
          })

          const erreurActuelle = res._unsafeUnwrapErr()
          expect(erreurActuelle).toBeInstanceOf(RejeterDemandeDélaiError)
          if (erreurActuelle instanceof RejeterDemandeDélaiError) {
            expect(erreurActuelle).toMatchObject(
              expect.objectContaining({
                demandeDélai: expect.objectContaining({
                  id: new UniqueEntityID(demandeDélaiId),
                  statut,
                }),
                raison: expect.any(String),
              })
            )
          }
          expect(publishToEventStore).not.toHaveBeenCalled()
          expect(fileRepo.save).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Possible de rejeter un délai si Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin', id: 'user-id' } as User

      const statutsPouvantÊtreAccordé: StatutDemandeDélai[] = ['envoyée', 'en-instruction']

      for (const statut of statutsPouvantÊtreAccordé) {
        it(`
      Lorsqu'il rejette une demande de délai avec comme statut '${statut}'
      Alors le courrier de réponse devrait être sauvegardé 
      Et l'évenement 'DélaiRejeté' devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()

          const projetId = 'le-projet-de-la-demande'

          const rejeterDemandéDélai = makeRejeterDemandeDélai({
            demandeDélaiRepo: fakeTransactionalRepo(
              makeFakeDemandeDélai({
                id: demandeDélaiId,
                statut,
                projetId,
              })
            ),
            publishToEventStore,
            fileRepo,
          })

          const rejet = await rejeterDemandéDélai({
            user,
            demandeDélaiId,
            fichierRéponse,
          })

          expect(rejet.isOk()).toBe(true)
          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'DélaiRejeté',
              payload: expect.objectContaining({
                demandeDélaiId,
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
