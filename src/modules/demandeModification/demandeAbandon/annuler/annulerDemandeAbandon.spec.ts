import { okAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import { fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../../shared'
import { StatusPreventsCancellingError } from '@modules/modificationRequest'
import { makeAnnulerDemandeAbandon } from './annulerDemandeAbandon'
import { makeFakeDemandeAbandon } from '../../../../__tests__/fixtures/aggregates/makeFakeDemandeAbandon'
import { StatutDemandeAbandon } from '../DemandeAbandon'

describe(`Commande annuler demande d'abandon`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
  beforeEach(() => publishToEventStore.mockClear())

  describe(`Annulation impossible si le porteur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un porteur n'ayant pas les droits sur le projet`, () => {
      it(`Lorsqu'il annule une demande d'abandon,
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
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
    })
  })

  describe(`Annulation possible si le porteur a les droits sur le projet`, () => {
    describe(`Etant donné un porteur ayant les droits sur le projet`, () => {
      describe(`Etant donnée une demande d'abandon dont le statut n'est pas compatible avec une annulation`, () => {
        const statutsIncompatiblesAvecAnnulation = [
          'accordée',
          'rejetée',
          'annulée',
        ] as StatutDemandeAbandon[]

        for (const statut of statutsIncompatiblesAvecAnnulation) {
          it(`Lorsque le porteur annule une demande d'abandon en statut ${statut},
              Alors une erreur StatusPreventsCancellingError devrait être émise`, async () => {
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
      })

      describe(`Etant donnée une demande d'abandon dont le statut est compatible avec une annulation`, () => {
        const statutsCompatiblesAvecAnnulation = [
          'envoyée',
          'en-instruction',
        ] as StatutDemandeAbandon[]
        for (const statut of statutsCompatiblesAvecAnnulation) {
          it(`Lorsque le porteur annule une demande d'abandon en statut ${statut},
              Alors une événement "AbandonAnnulé" devrait être émis`, async () => {
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
    })
  })
})
