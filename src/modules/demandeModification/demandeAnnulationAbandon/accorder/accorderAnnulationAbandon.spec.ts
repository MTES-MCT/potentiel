import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { CahierDesChargesModifié, ProjectAppelOffre, User } from '@entities'
import { InfraNotAvailableError } from '@modules/shared'
import {
  DemandeAnnulationAbandon,
  statutsDemandeAnnulationAbandon,
} from '../DemandeAnnulationAbandon'
import { makeAccorderAnnulationAbandon } from './accorderAnnulationAbandon'
import { Project } from '@modules/project'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { StatutDemandeIncompatibleAvecAccordAnnulationAbandonError } from './StatutDemandeIncompatibleAvecAccordAnnulationAbandonError'
import { StatutProjetIncompatibleAvecAccordAnnulationAbandonError } from './StatutProjetIncompatibleAvecAccordAnnulationAbandonError'
import { CDCProjetIncompatibleAvecAccordAnnulationAbandonError } from './CDCProjetIncompatibleAvecAccordAnnulationAbandonError'

describe(`Accorder une annulation d'abandon de projet`, () => {
  // commande
  const utilisateur = { role: 'admin' } as User
  const demandeId = new UniqueEntityID().toString()
  const projet = makeFakeProject()

  // dépendances
  const projectRepo = fakeRepo({
    ...projet,
    isClasse: true,
    abandonedOn: 123,
    cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
  } as Project)

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  const demandeAnnulationAbandonRepo = fakeTransactionalRepo({
    statut: 'envoyée',
  } as DemandeAnnulationAbandon)

  const getProjectAppelOffre = () =>
    ({
      cahiersDesChargesModifiésDisponibles: [
        {
          type: 'modifié',
          paruLe: '30/08/2022',
          délaiAnnulationAbandon: new Date(),
        } as CahierDesChargesModifié,
      ] as Readonly<Array<CahierDesChargesModifié>>,
    } as ProjectAppelOffre)

  describe(`Cas d'une demande qui n'est pas en statut "envoyée"`, () => {
    for (const statut of statutsDemandeAnnulationAbandon.filter((statut) => statut !== 'envoyée')) {
      it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut ${statut},
        alors il devrait être notifié que l'action est impossible en raison du statut incompatible de la demande`, async () => {
        const demandeAnnulationAbandonRepo = fakeTransactionalRepo({
          statut: 'annulée',
        } as DemandeAnnulationAbandon)

        const accorder = makeAccorderAnnulationAbandon({
          publishToEventStore,
          projectRepo,
          demandeAnnulationAbandonRepo,
          getProjectAppelOffre,
        })

        const accord = await accorder({ utilisateur, demandeId })

        expect(accord.isErr()).toEqual(true)
        accord.isErr() &&
          expect(accord.error).toBeInstanceOf(
            StatutDemandeIncompatibleAvecAccordAnnulationAbandonError
          )
      })
    }
  })

  describe(`Cas d'un projet qui n'est pas abandonné`, () => {
    it(`Etant donné un projet non abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon,
        alors il devrait être notifié que l'action est impossible car le projet n'est pas abandonné`, async () => {
      const projectRepo = fakeRepo({ ...projet, isClasse: true, abandonedOn: 0 } as Project)

      const accorder = makeAccorderAnnulationAbandon({
        publishToEventStore,
        projectRepo,
        demandeAnnulationAbandonRepo,
        getProjectAppelOffre,
      })

      const accord = await accorder({ utilisateur, demandeId })

      expect(accord.isErr()).toEqual(true)
      accord.isErr() &&
        expect(accord.error).toBeInstanceOf(
          StatutProjetIncompatibleAvecAccordAnnulationAbandonError
        )
    })
  })

  describe(`Cas d'un CDC incompatible avec une annulation d'abandon`, () => {
    it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut "envoyée",
        mais que le CDC actuel du projet ne prévoit pas d'annulation d'abandon,
        alors il devrait être notifié que l'action est impossible en raison du CDC incompatible`, async () => {
      const getProjectAppelOffre = () =>
        ({
          cahiersDesChargesModifiésDisponibles: [
            {
              type: 'modifié',
              paruLe: '30/08/2022',
              délaiAnnulationAbandon: undefined,
            } as CahierDesChargesModifié,
          ] as Readonly<Array<CahierDesChargesModifié>>,
        } as ProjectAppelOffre)

      const accorder = makeAccorderAnnulationAbandon({
        publishToEventStore,
        projectRepo,
        demandeAnnulationAbandonRepo,
        getProjectAppelOffre,
      })

      const accord = await accorder({ utilisateur, demandeId })

      expect(accord.isErr()).toEqual(true)
      accord.isErr() &&
        expect(accord.error).toBeInstanceOf(CDCProjetIncompatibleAvecAccordAnnulationAbandonError)
    })
  })

  describe(`Conditions d'acceptation réunies`, () => {
    it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut "envoyée",
        et que le CDC actuel du projet prévoit l'annulation d'abandon,
        alors la demande devrait être accordée`, () => {
      //...
    })
  })
})
