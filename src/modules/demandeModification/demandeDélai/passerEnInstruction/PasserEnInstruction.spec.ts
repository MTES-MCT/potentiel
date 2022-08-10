import { okAsync } from '@core/utils'
import { DomainEvent } from '@core/domain'

import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { UserRole } from '@modules/users'

import { User } from '@entities'

import { makePasserDemandeDélaiEnInstruction } from './passerEnInstruction'
import { PasserEnInstructionDemandeDélaiStatutIncompatibleError } from './PasserEnInstructionDemandeDélaiStatutIncompatibleError'
import { StatutDemandeDélai } from '../DemandeDélai'

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

  describe(`Impossible de passer en instruction une demande avec un statut autre que 'envoyée'`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User
      const shouldUserAccessProject = jest.fn(async () => true)

      const statutsNePouvantPasPasserLaDemandeEnInstruction: StatutDemandeDélai[] = [
        'accordée',
        'refusée',
        'annulée',
        'en-instruction',
      ]

      for (const statut of statutsNePouvantPasPasserLaDemandeEnInstruction) {
        const demandeDélai = makeFakeDemandeDélai({ projetId, statut })

        it(`
      Lorsque l'utilisateur passe une demande de délai avec comme statut '${statut}'
      Alors une erreur ImpossibleDAccorderDemandeDélai devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
          const passerDemandeDélaiEnInstruction = makePasserDemandeDélaiEnInstruction({
            publishToEventStore,
            shouldUserAccessProject,
            demandeDélaiRepo: {
              ...fakeTransactionalRepo(demandeDélai),
              ...fakeRepo(demandeDélai),
            },
          })

          const res = await passerDemandeDélaiEnInstruction({
            user,
            demandeDélaiId,
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(
            PasserEnInstructionDemandeDélaiStatutIncompatibleError
          )
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe(`Impossible de passer en instruction une demande si l'utilisateur n'a pas les droits d'accès au projet`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User

      const shouldUserAccessProject = jest.fn(async () => false)

      const demandeDélai = makeFakeDemandeDélai({ projetId, statut: 'envoyée' })

      it(`
      Lorsque l'utilisateur passe une demande de délai en instruction
      Alors une erreur UnauthorizedError devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
        const passerDemandeDélaiEnInstruction = makePasserDemandeDélaiEnInstruction({
          publishToEventStore,
          shouldUserAccessProject,
          demandeDélaiRepo: {
            ...fakeTransactionalRepo(demandeDélai),
            ...fakeRepo(demandeDélai),
          },
        })

        const res = await passerDemandeDélaiEnInstruction({
          user,
          demandeDélaiId,
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Passer une demande de délai en instruction`, () => {
    describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
      const user = { role: 'admin' } as User
      const shouldUserAccessProject = jest.fn(async () => true)

      it(`
      Lorsqu'il passe une demande de délai en instruction
      Alors l'évenement 'ModificationRequestInstructionStarted' devrait être publié dans le store`, async () => {
        const demandeDélai = makeFakeDemandeDélai({ projetId, statut: 'envoyée' })

        const passerDemandeDélaiEnInstruction = makePasserDemandeDélaiEnInstruction({
          shouldUserAccessProject,
          publishToEventStore,
          demandeDélaiRepo: {
            ...fakeTransactionalRepo(demandeDélai),
            ...fakeRepo(demandeDélai),
          },
        })

        const res = await passerDemandeDélaiEnInstruction({
          user,
          demandeDélaiId,
        })

        expect(res.isOk()).toBe(true)
        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'ModificationRequestInstructionStarted',
            payload: expect.objectContaining({
              modificationRequestId: demandeDélaiId,
            }),
          })
        )
      })
    })
  })
})
