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
})
