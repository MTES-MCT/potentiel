import { okAsync } from '@core/utils'
import { DomainEvent, UniqueEntityID } from '@core/domain'
import { InfraNotAvailableError } from '@modules/shared'
import {
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates'
import { makeAnnulerDemandeDélai } from './annulerDemandeDélai'
import { DemandeDélai, StatutDemandeDélai } from '../DemandeDélai'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../../shared'
import { DélaiAnnulé, StatusPreventsCancellingError } from '@modules/modificationRequest'

describe(`Commande annuler demande délai`, () => {
  const projectId = new UniqueEntityID().toString()
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

  describe(`Etant donné un porteur n'ayant pas les droits sur le projet`, () => {
    it(`Lorsque le porteur annule une demande de délai,
    alors une erreur UnauthorizedError devrait être retournée`, async () => {
      publishToEventStore.mockClear()

      const shouldUserAccessProject = jest.fn(async () => false)

      const fakeDemandeDélai = makeFakeDemandeDélai()

      const demandeDélaiRepo = fakeTransactionalRepo(fakeDemandeDélai as DemandeDélai)

      const annulerDemandéDélai = makeAnnulerDemandeDélai({
        shouldUserAccessProject,
        demandeDélaiRepo,
        publishToEventStore,
      })

      const res = await annulerDemandéDélai({
        projectId,
        user,
        demandeDélaiId: new UniqueEntityID().toString(),
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Etant donné un utilisateur ayant les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => true)

    describe(`Etant donnée une demande de délai dont le statut est n'est pas compatible avec une annulation`, () => {
      const statutsIncompatiblesAvecAnnulation = [
        'accordée',
        'rejetée',
        'annulée',
      ] as StatutDemandeDélai[]

      for (const statut of statutsIncompatiblesAvecAnnulation) {
        it(`Lorsque le porteur annule une demande de délai en statut ${statut},
    alors une erreur StatusPreventsCancellingError devrait être émise`, async () => {
          publishToEventStore.mockClear()

          const demandeDélaiId = new UniqueEntityID().toString()

          const demandeDélaiRepo = fakeTransactionalRepo(
            makeFakeDemandeDélai(demandeDélaiId, statut) as DemandeDélai
          )

          const annulerDemandéDélai = makeAnnulerDemandeDélai({
            shouldUserAccessProject,
            demandeDélaiRepo,
            publishToEventStore,
          })

          const res = await annulerDemandéDélai({
            projectId,
            user,
            demandeDélaiId,
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(StatusPreventsCancellingError)
          expect(publishToEventStore).not.toHaveBeenCalled()
        })
      }
    })

    describe(`Etant donnée une demande de délai dont le statut est compatible avec une annulation`, () => {
      const statutsCompatiblesAvecAnnulation = ['envoyée', 'en-instruction'] as StatutDemandeDélai[]
      for (const statut of statutsCompatiblesAvecAnnulation) {
        it(`Lorsque le porteur annule une demande de délai en statut ${statut},
    alors une événement "DélaiAnnulé" devrait être émis`, async () => {
          publishToEventStore.mockClear()

          const demandeDélaiId = new UniqueEntityID().toString()

          const demandeDélaiRepo = fakeTransactionalRepo(
            makeFakeDemandeDélai(demandeDélaiId, statut) as DemandeDélai
          )

          const annulerDemandéDélai = makeAnnulerDemandeDélai({
            shouldUserAccessProject,
            demandeDélaiRepo,
            publishToEventStore,
          })

          await annulerDemandéDélai({ projectId, user, demandeDélaiId })

          const firstEvent = publishToEventStore.mock.calls[0][0]
          expect(firstEvent).toBeInstanceOf(DélaiAnnulé)
          expect(firstEvent.payload).toMatchObject({
            demandeDélaiId,
            annuléPar: user.id,
          })
        })
      }
    })
  })
})
