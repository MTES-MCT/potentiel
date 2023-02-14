import { okAsync } from '@core/utils'
import { DomainEvent } from '@core/domain'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import {
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates'
import { makeAnnulerDemandeDélai } from './annulerDemandeDélai'
import { StatutDemandeDélai, statutsDemandeDélai } from '../DemandeDélai'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { StatusPreventsCancellingError } from '@modules/modificationRequest'

describe(`Commande annuler demande délai`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  )
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

  beforeEach(() => {
    publishToEventStore.mockClear()
  })

  it(`Etant donné un porteur n'ayant pas les droits sur le projet
      Lorsqu'il annule une demande de délai,
      Alors il devrait être informé qu'il n'est pas autorisé à faire cette action`, async () => {
    const shouldUserAccessProject = jest.fn(async () => false)
    const demandeDélaiRepo = fakeTransactionalRepo(
      makeFakeDemandeDélai({ projetId: 'le-projet-de-la-demande' })
    )

    const annulerDemandéDélai = makeAnnulerDemandeDélai({
      shouldUserAccessProject,
      demandeDélaiRepo,
      publishToEventStore,
    })

    const res = await annulerDemandéDélai({
      user,
      demandeDélaiId: 'la-demande-a-annuler',
    })

    expect(res.isErr()).toBe(true)
    if (res.isErr()) {
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    }
  })

  const shouldUserAccessProject = jest.fn(async () => true)
  const statutsIncompatiblesAvecAnnulation: StatutDemandeDélai[] = statutsDemandeDélai.filter(
    (statut) => !['envoyée', 'en-instruction'].includes(statut)
  )
  for (const statut of statutsIncompatiblesAvecAnnulation) {
    it(`Etant donné un porteur ayant les droits sur le projet
        Lorsqu'il annule une demande de délai en statut ${statut},
        Alors il devrait être informé que le statut ${statut} est incompatible avec une annulation de demande`, async () => {
      const demandeDélaiId = 'la-demande-a-annuler'

      const demandeDélaiRepo = fakeTransactionalRepo(
        makeFakeDemandeDélai({
          id: demandeDélaiId,
          statut,
          projetId: 'le-projet-de-la-demande',
        })
      )

      const annulerDemandéDélai = makeAnnulerDemandeDélai({
        shouldUserAccessProject,
        demandeDélaiRepo,
        publishToEventStore,
      })

      const res = await annulerDemandéDélai({
        user,
        demandeDélaiId,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(StatusPreventsCancellingError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  }

  const statutsCompatiblesAvecAnnulation: StatutDemandeDélai[] = statutsDemandeDélai.filter(
    (statut) => ['envoyée', 'en-instruction'].includes(statut)
  )
  for (const statut of statutsCompatiblesAvecAnnulation) {
    it(`Etant donné un porteur ayant les droits sur le projet
          Lorsqu'il annule une demande de délai en statut ${statut},
          Alors il devrait être informé que l'action a bien été prise en compte`, async () => {
      const demandeDélaiId = 'la-demande-a-annuler'

      const demandeDélaiRepo = fakeTransactionalRepo(
        makeFakeDemandeDélai({ id: demandeDélaiId, statut, projetId: 'identifiant-projet' })
      )

      const annulerDemandéDélai = makeAnnulerDemandeDélai({
        shouldUserAccessProject,
        demandeDélaiRepo,
        publishToEventStore,
      })

      await annulerDemandéDélai({ user, demandeDélaiId })

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DélaiAnnulé',
          payload: expect.objectContaining({
            demandeDélaiId,
            annuléPar: user.id,
            projetId: 'identifiant-projet',
          }),
        })
      )
    })
  }
})
