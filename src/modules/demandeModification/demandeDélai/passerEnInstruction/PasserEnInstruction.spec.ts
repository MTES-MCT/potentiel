import { okAsync } from '@core/utils'
import { DomainEvent } from '@core/domain'

import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { UserRole } from '@modules/users'

import { User } from '@entities'
import { makePasserDemandeDélaiEnInstruction } from './PasserEnInstruction'

import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates'

describe(`Passer une demande de délai en instruction`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  const demandeDélaiId = 'demande-délai-id'
  const projetId = 'projet-id'

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible si utilisateur non Admin/dgec/dreal`, () => {
    describe(`Etant donné un utilisateur autre que Admin, DGEC ou DREAL`, () => {
      const rolesNePouvantPasPasserUneDemandeDélaiEnInstruction: UserRole[] = [
        'acheteur-obligé',
        'ademe',
        'porteur-projet',
      ]

      const shouldUserAccessProject = jest.fn(async () => false)
      const demandeDélai = makeFakeDemandeDélai({ projetId })

      const passerDemandeDélaiEnInstruction = makePasserDemandeDélaiEnInstruction({
        shouldUserAccessProject,
        publishToEventStore,
        demandeDélaiRepo: { ...fakeTransactionalRepo(demandeDélai), ...fakeRepo(demandeDélai) },
      })

      for (const role of rolesNePouvantPasPasserUneDemandeDélaiEnInstruction) {
        const user = { role } as User

        it(`
        Lorsque l'utilisateur ${role} passe une demande de délai en instruction
        Alors une erreur UnauthorizedError devrait être retournée
        Et aucun évènement ne devrait être publié dans le store`, async () => {
          const res = await passerDemandeDélaiEnInstruction({
            user,
            demandeDélaiId,
          })
          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })
  })
})
