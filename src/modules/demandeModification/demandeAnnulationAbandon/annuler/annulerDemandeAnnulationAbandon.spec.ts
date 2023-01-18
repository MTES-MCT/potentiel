import { okAsync } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { makeAnnulerDemandeAnnulationAbandon } from './annulerDemandeAnnulationAbandon'
import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon'
import { StatutRéponseIncompatibleAvecAnnulationError } from '../../errors/StatutRéponseIncompatibleAvecAnnulationError'

describe(`Annuler une demande d'annulation d'abandon`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const user = { role: 'porteur-projet' } as User

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Impossible si le porteur n'a pas les droits sur le projet`, () => {
    it(`Etant donné un porteur n'ayant pas les droits sur le projet
        Lorsqu'il annule une demande d'annulation d'abandon,
        Alors le porteur devrait être averti qu'il n'a pas les droits pour annuler la demande`, async () => {
      const demandeAnnulationAbandonRepo = fakeTransactionalRepo({
        projetId: 'le-projet-de-la-demande',
      } as DemandeAnnulationAbandon)

      const annuler = makeAnnulerDemandeAnnulationAbandon({
        shouldUserAccessProject: jest.fn(async () => false),
        demandeAnnulationAbandonRepo,
        publishToEventStore,
      })

      const annulation = await annuler({ user, demandeId: 'la-demande-a-annuler' })

      expect(annulation._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible si le statut de la demande n'est pas envoyée `, () => {
    for (const statut of ['annulée', 'accordée', 'refusée']) {
      it(`Etant donné un porteur ayant les droits sur le projet
          Lorsqu'il annule une demande d'annulation d'abandon ${statut},
          Alors le porteur devrait être averti qu'il n'est pas possible d'annuler une demande ${statut}`, async () => {
        const demandeAnnulationAbandonRepo = fakeTransactionalRepo({
          projetId: 'le-projet-de-la-demande',
          statut,
        } as DemandeAnnulationAbandon)

        const annuler = makeAnnulerDemandeAnnulationAbandon({
          shouldUserAccessProject: jest.fn(async () => true),
          demandeAnnulationAbandonRepo,
          publishToEventStore,
        })

        const annulation = await annuler({ user, demandeId: 'la-demande-a-annuler' })

        expect(annulation._unsafeUnwrapErr()).toBeInstanceOf(
          StatutRéponseIncompatibleAvecAnnulationError
        )
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    }
  })

  describe(`Annuler la demande`, () => {
    it(`Etant donné un porteur ayant les droits sur le projet
        Lorsqu'il annule une demande d'annulation d'abandon,
        Alors la demande devrait être annulée`, async () => {
      const demandeAnnulationAbandonRepo = fakeTransactionalRepo({
        projetId: 'le-projet-de-la-demande',
        statut: 'envoyée',
      } as DemandeAnnulationAbandon)

      const annuler = makeAnnulerDemandeAnnulationAbandon({
        shouldUserAccessProject: jest.fn(async () => true),
        demandeAnnulationAbandonRepo,
        publishToEventStore,
      })

      await annuler({ user, demandeId: 'la-demande-a-annuler' })

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AnnulationAbandonAnnulée',
          payload: {
            demandeId: 'la-demande-a-annuler',
            annuléePar: user.id,
          },
        })
      )
    })
  })
})

//     describe(`Etant donnée une demande d'annulation d'abandon dont le statut est compatible avec une annulation`, () => {
//       const statutsCompatiblesAvecAnnulation = [
//         'envoyée',
//         'en-instruction',
//       ] as StatutDemandeAbandon[]
//       for (const statut of statutsCompatiblesAvecAnnulation) {
//         it(`Lorsque le porteur annule une demande d'annulation d'abandon en statut ${statut},
//             Alors une événement "AbandonAnnulé" devrait être émis`, async () => {
//           const demandeAbandonId = 'la-demande-a-annuler'

//           const demandeAbandonRepo = fakeTransactionalRepo(
//             makeFakeDemandeAbandon({
//               id: demandeAbandonId,
//               statut,
//               projetId: 'identifiant-projet',
//             })
//           )

//           const annulerDemandeAbandon = makeAnnulerDemandeAbandon({
//             shouldUserAccessProject: jest.fn(async () => true),
//             demandeAbandonRepo,
//             publishToEventStore,
//           })

//           await annulerDemandeAbandon({ user, demandeAbandonId })

//           expect(publishToEventStore).toHaveBeenCalledWith(
//             expect.objectContaining({
//               type: 'AbandonAnnulé',
//               payload: expect.objectContaining({
//                 demandeAbandonId,
//                 annuléPar: user.id,
//                 projetId: 'identifiant-projet',
//               }),
//             })
//           )
//         })
//       }
//     })
//   })
// })
