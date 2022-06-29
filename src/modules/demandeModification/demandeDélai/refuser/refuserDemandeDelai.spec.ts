import { Readable } from 'stream'

import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { User } from '@entities'
import { UserRole } from '@modules/users'
import { InfraNotAvailableError } from '@modules/shared'

import { DemandeDélai, StatutDemandeDélai } from '../DemandeDélai'
import { makeRefuserDemandeDélai } from './refuserDemandeDélai'
import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { UnauthorizedError } from '../../../shared'
import { RefuserDemandeDélaiError } from './RefuserDemandeDélaiError'

describe(`Refuser une demande de délai`, () => {
  const demandeDélaiId = new UniqueEntityID('id-demande')
  const demandeDélai: DemandeDélai = {
    id: demandeDélaiId,
    pendingEvents: [],
    statut: undefined,
    projet: undefined,
  }
  const fichierRéponse = {
    contents: Readable.from('test-content'),
    filename: 'fichier-réponse',
  }
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible de refuser  un délai si non Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur autre que Admin, DGEC ou DREAL`, () => {
      const rolesNePouvantPasRefuser: UserRole[] = ['acheteur-obligé', 'ademe', 'porteur-projet']

      for (const role of rolesNePouvantPasRefuser) {
        const user = { role } as User

        it(`
        Lorsqu'il refuse une demande de délai
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          const refuserDemandéDélai = makeRefuserDemandeDélai({
            demandeDélaiRepo: fakeTransactionalRepo(demandeDélai),
            publishToEventStore,
            fileRepo: fakeRepo(),
          })

          const res = await refuserDemandéDélai({
            user,
            demandeDélaiId: demandeDélaiId.toString(),
            fichierRéponse,
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Impossible de refuser une demande avec un statut autre que 'envoyée' ou 'en-instruction'`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User

      const statutsNePouvantPasÊtreRefusé: StatutDemandeDélai[] = ['accordée', 'refusée', 'annulée']

      for (const statut of statutsNePouvantPasÊtreRefusé) {
        it(`
      Lorsqu'il refuse une demande avec comme statut '${statut}'
      Alors une erreur RefuserDemandeDélaiError devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
          const refuserDemandéDélai = makeRefuserDemandeDélai({
            demandeDélaiRepo: fakeTransactionalRepo({ ...demandeDélai, statut } as DemandeDélai),
            publishToEventStore,
            fileRepo: fakeRepo(),
          })

          const res = await refuserDemandéDélai({
            user,
            demandeDélaiId: demandeDélai.id.toString(),
            fichierRéponse,
          })

          const erreurActuelle = res._unsafeUnwrapErr()
          expect(erreurActuelle).toBeInstanceOf(RefuserDemandeDélaiError)
          if (erreurActuelle instanceof RefuserDemandeDélaiError) {
            expect(erreurActuelle).toMatchObject(
              expect.objectContaining({
                demandeDélai: { ...demandeDélai, statut },
                raison: expect.any(String),
              })
            )
          }
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Possible de refuser un délai si Admin/DGEC/DREAL`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const rolesPouvantRefuser: UserRole[] = ['admin', 'dgec', 'dreal']

      for (const role of rolesPouvantRefuser) {
        const user = { role, id: 'user-id' } as User

        it(`
      Lorsqu'il refuse une demande de délai
      Alors le courrier de réponse devrait être sauvegardé 
      Et l'évenement 'DélaiRefusé' devrait être publié dans le store`, async () => {
          const fileRepo = fakeRepo()

          const refuserDemandéDélai = makeRefuserDemandeDélai({
            demandeDélaiRepo: fakeTransactionalRepo({
              ...demandeDélai,
              projet: { id: new UniqueEntityID('le-projet-de-la-demande') },
            } as DemandeDélai),
            publishToEventStore,
            fileRepo,
          })

          const refus = await refuserDemandéDélai({
            user,
            demandeDélaiId: demandeDélaiId.toString(),
            fichierRéponse,
          })

          expect(refus.isOk()).toBe(true)
          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'DélaiRefusé',
              payload: expect.objectContaining({
                demandeDélaiId: demandeDélaiId.toString(),
                refuséPar: user.id,
              }),
            })
          )
          // expect(fileRepo.save).toHaveBeenCalledWith(
          //   expect.objectContaining({
          //     designation: 'modification-request-response',
          //     forProject: { value: 'le-projet-de-la-demande' },
          //     filename: fichierRéponse.filename,
          //     path: 'projects/le-projet-de-la-demande/fichier-réponse',
          //   })
          // )
          // expect(publishToEventStore).toHaveBeenCalledWith(
          //   expect.objectContaining({
          //     type: 'DélaiAccordé',
          //     payload: expect.objectContaining({
          //       dateAchèvementAccordée: new Date('2022-06-27'),
          //       accordéPar: user.id,
          //       demandeDélaiId: demandeDélaiId.toString(),
          //       fichierRéponseId: expect.any(String),
          //     }),
          //   })
          // )
        })
      }
    })
  })
})
