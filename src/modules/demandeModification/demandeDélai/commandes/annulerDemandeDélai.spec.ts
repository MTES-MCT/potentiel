import { okAsync } from '@core/utils'
import { DomainEvent, UniqueEntityID } from '@core/domain'
import { InfraNotAvailableError } from '@modules/shared'
import {
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates'
import { makeAnnulerDemandeDélai } from './annulerDemandeDélai'
import { DemandeDélai } from '../DemandeDélai'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../../shared'
import { DélaiAnnulé } from '@modules/modificationRequest'

describe(`Commande annuler demande délai`, () => {
  const projectId = new UniqueEntityID().toString()
  const fakeDemandeDélai = makeFakeDemandeDélai()
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  const demandeDélaiRepo = fakeTransactionalRepo(fakeDemandeDélai as DemandeDélai)

  describe(`Etant donné un porteur n'ayant pas les droits sur le projet`, () => {
    it(`Lorsque le porteur annule une demande de délai,
    alors une erreur UnauthorizedError devrait être retournée`, async () => {
      publishToEventStore.mockClear()
      const shouldUserAccessProject = jest.fn(async () => false)
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const annulerDemandéDélai = makeAnnulerDemandeDélai({
        shouldUserAccessProject,
        demandeDélaiRepo,
        publishToEventStore,
      })

      const id = new UniqueEntityID().toString()
      const res = await annulerDemandéDélai({ projectId, user, demandeDélaiId: id })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })
  describe(`Etant donné un utilisateur ayant les droits sur le projet`, () => {
    it(`Lorsque le porteur annule une demande dé délai, 
    alors un événement DemandeDélaiAnnulée devrait être émis`, async () => {
      publishToEventStore.mockClear()
      const shouldUserAccessProject = jest.fn(async () => true)
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const annulerDemandéDélai = makeAnnulerDemandeDélai({
        shouldUserAccessProject,
        demandeDélaiRepo,
        publishToEventStore,
      })

      const id = new UniqueEntityID().toString()
      await annulerDemandéDélai({ projectId, user, demandeDélaiId: id })

      const firstEvent = publishToEventStore.mock.calls[0][0]
      expect(firstEvent).toBeInstanceOf(DélaiAnnulé)
      expect(firstEvent.payload).toMatchObject({
        demandeDélaiId: id,
        annuléPar: user.id,
      })
    })
    // TO DO : voir les cas où la demande n'existe pas, la demande n'est pas en statut "envoyée"
  })
})
