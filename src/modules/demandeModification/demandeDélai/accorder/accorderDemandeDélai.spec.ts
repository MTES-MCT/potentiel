import { okAsync } from '@core/utils'
import { DomainEvent } from '@core/domain'
import { InfraNotAvailableError } from '@modules/shared'
import { fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../../shared'
import { construireAccorderDemandeDélai } from './accorderDemandeDélai'
import { UserRole } from 'src/modules/users'
import { DemandeDélai, StatutDemandeDélai } from '../DemandeDélai'
import { User } from '@entities'
import { ImpossibleDAccorderDemandeDélai } from './ImpossibleDAccorderDemandeDélai'

describe(`Accorder une demande de délai`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )

  describe(`Etant donné un utilisateur autre que Admin, DGEC ou DREAL`, () => {
    const rolesNePouvantPasAccorderUneDemandeDélai: UserRole[] = [
      'acheteur-obligé',
      'ademe',
      'porteur-projet',
    ]

    for (const role of rolesNePouvantPasAccorderUneDemandeDélai) {
      const user = makeFakeUser({ role })

      it(`
      Lorsqu'il accorde une demande de délai
      Alors une erreur UnauthorizedError devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
        publishToEventStore.mockClear()

        const accorderDemandéDélai = construireAccorderDemandeDélai({
          demandeDélaiRepo: fakeTransactionalRepo(),
          publishToEventStore,
        })

        const res = await accorderDemandéDélai({
          user,
          demandeDélaiId: 'demande-id',
          dateAchèvementAccordée: new Date(),
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    }
  })

  describe(`Etant donné un utilisateur Admin, DGEC ou DREAL`, () => {
    const user = { role: 'admin' } as User

    const statutsNePouvantPasÊtreAccordé = [
      'accordée',
      'rejetée',
      'annulée',
    ] as StatutDemandeDélai[]

    for (const statut of statutsNePouvantPasÊtreAccordé) {
      it(`
      Lorsqu'il accorde une demande de délai avec comme statut '${statut}'
      Alors une erreur ImpossibleDAccorderDemandeDélai devrait être retournée
      Et aucun évènement ne devrait être publié dans le store`, async () => {
        publishToEventStore.mockClear()

        const accorderDemandéDélai = construireAccorderDemandeDélai({
          demandeDélaiRepo: fakeTransactionalRepo({ statut } as DemandeDélai),
          publishToEventStore,
        })

        const res = await accorderDemandéDélai({
          user,
          demandeDélaiId: 'demande-id',
          dateAchèvementAccordée: new Date(),
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(ImpossibleDAccorderDemandeDélai)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    }

    it(`
      Lorsqu'il accorde une demande de délai avec comme statut 'envoyée'
      Alors l'évenement 'DélaiAccordé' devrait être publié dans le store`, async () => {
      publishToEventStore.mockClear()

      const accorderDemandéDélai = construireAccorderDemandeDélai({
        demandeDélaiRepo: fakeTransactionalRepo({ statut: 'envoyée' } as DemandeDélai),
        publishToEventStore,
      })

      const res = await accorderDemandéDélai({
        user,
        demandeDélaiId: 'demande-id',
        dateAchèvementAccordée: new Date('2022-06-27'),
      })

      expect(res.isOk()).toBe(true)
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DélaiAccordé',
          payload: expect.objectContaining({
            dateAchèvementAccordée: new Date('2022-06-27'),
            accordéPar: user.id,
            demandeDélaiId: 'demande-id',
          }),
        })
      )
    })
  })
})
