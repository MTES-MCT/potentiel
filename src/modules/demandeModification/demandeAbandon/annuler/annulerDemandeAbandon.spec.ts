import { okAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { StatusPreventsCancellingError } from '@modules/modificationRequest'
import { makeAnnulerDemandeAbandon } from './annulerDemandeAbandon'
import { makeFakeDemandeAbandon } from '../../../../__tests__/fixtures/aggregates/makeFakeDemandeAbandon'
import { StatutDemandeAbandon, statutsDemandeAbandon } from '../DemandeAbandon'

describe(`Commande annuler demande d'abandon`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
  beforeEach(() => publishToEventStore.mockClear())

  it(`Etant donné un porteur n'ayant pas les droits sur le projet,
      Lorsqu'il souhaite annuler une demande d'abandon,
      Alors il devrait être informé qu'il n'a pas les droits nécessaire pour réaliser cette action`, async () => {
    const demandeAbandonRepo = fakeTransactionalRepo(
      makeFakeDemandeAbandon({ projetId: 'le-projet-de-la-demande' })
    )

    const annulerDemandeAbandon = makeAnnulerDemandeAbandon({
      shouldUserAccessProject: jest.fn(async () => false),
      demandeAbandonRepo,
      publishToEventStore,
    })

    const res = await annulerDemandeAbandon({ user, demandeAbandonId: 'la-demande-a-annuler' })

    expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
    expect(publishToEventStore).not.toHaveBeenCalled()
  })

  const statutsIncompatiblesAvecAnnulation: StatutDemandeAbandon[] = statutsDemandeAbandon.filter(
    (statut) => !['envoyée', 'en instruction', 'en attente de confirmation'].includes(statut)
  )

  for (const statut of statutsIncompatiblesAvecAnnulation) {
    it(`Étant donné un porteur ayant les droits sur le projet
            Lorsqu'il annule une demande d'abandon en statut ${statut},
            Alors il devrait être prévenu que le statut est incompatible pour une annulation`, async () => {
      const demandeAbandonId = 'la-demande-a-annuler'

      const demandeAbandonRepo = fakeTransactionalRepo(
        makeFakeDemandeAbandon({
          id: demandeAbandonId,
          statut,
          projetId: 'le-projet-de-la-demande',
        })
      )

      const annulerDemandéAbandon = makeAnnulerDemandeAbandon({
        shouldUserAccessProject: jest.fn(async () => true),
        demandeAbandonRepo,
        publishToEventStore,
      })

      const res = await annulerDemandéAbandon({ user, demandeAbandonId })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(StatusPreventsCancellingError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  }

  const statutsCompatiblesAvecAnnulation = [
    'envoyée',
    'en instruction',
    'en attente de confirmation',
  ] as StatutDemandeAbandon[]
  for (const statut of statutsCompatiblesAvecAnnulation) {
    it(`Étant donné un porteur ayant les droits sur le projet
        Lorsqu'il annule une demande d'abandon en statut ${statut},
        Alors la demande d'abandon devrait être annulé`, async () => {
      const demandeAbandonId = 'la-demande-a-annuler'

      const demandeAbandonRepo = fakeTransactionalRepo(
        makeFakeDemandeAbandon({
          id: demandeAbandonId,
          statut,
          projetId: 'identifiant-projet',
        })
      )

      const annulerDemandeAbandon = makeAnnulerDemandeAbandon({
        shouldUserAccessProject: jest.fn(async () => true),
        demandeAbandonRepo,
        publishToEventStore,
      })

      await annulerDemandeAbandon({ user, demandeAbandonId })

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AbandonAnnulé',
          payload: expect.objectContaining({
            demandeAbandonId,
            annuléPar: user.id,
            projetId: 'identifiant-projet',
          }),
        })
      )
    })
  }
})
