import { UniqueEntityID } from '@core/domain'
import { ProjectAppelOffre } from '@entities'
import { AnnulationAbandonAccordée } from '@modules/demandeModification'
import { InfraNotAvailableError } from '@modules/shared'
import { okAsync } from 'neverthrow'
import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { makeOnAnnulationAbandonAccordée } from './onAnnulationAbandonAccordée'

describe(`Handler de projet onAnnulationAbandonAccordée`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  const projetId = new UniqueEntityID().toString()
  const completionDueOn = new Date().getTime()
  const dcrDueOn = new Date().getTime()
  const notifiedOn = new Date('2020-01-01').getTime()

  const projectRepo = fakeTransactionalRepo(
    makeFakeProject({ id: projetId, completionDueOn, dcrDueOn, notifiedOn })
  )

  const événemement = new AnnulationAbandonAccordée({
    payload: {
      demandeId: new UniqueEntityID().toString(),
      projetId,
      accordéPar: new UniqueEntityID().toString(),
      fichierRéponseId: new UniqueEntityID().toString(),
    },
  })
  describe(`Cas d'un projet soumis à garanties financières`, () => {
    it(`Etant donné un événement AnnulationAbandonAccordée émis pour un projet soumis à GF, 
  alors l'abandon du projet devrait être annulé, 
  et le projet devrait être en attente de nouvelles garanties financières`, async () => {
      const getProjectAppelOffre = jest.fn(() => ({ isSoumisAuxGF: true } as ProjectAppelOffre))
      const onAnnulationAbandonAccordée = makeOnAnnulationAbandonAccordée({
        projectRepo,
        publishToEventStore,
        getProjectAppelOffre,
      })

      await onAnnulationAbandonAccordée(événemement)

      expect(publishToEventStore).toHaveBeenCalledTimes(2)

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AbandonProjetAnnulé',
          payload: {
            projetId,
            dateAchèvement: new Date(completionDueOn),
            dateLimiteEnvoiDcr: dcrDueOn,
          },
        })
      )

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ProjectGFDueDateSet',
          payload: {
            projectId: projetId,
            garantiesFinancieresDueOn: new Date('2020-03-01').getTime(),
          },
        })
      )
    })
  })

  describe(`Cas d'un projet NON soumis à garanties financières`, () => {
    it(`Etant donné un événement AnnulationAbandonAccordée émis pour un projet non soumis à GF, 
  alors l'abandon du projet devrait être annulé, 
  et le projet ne devrait pas être en attente de nouvelles garanties financières`, async () => {
      const getProjectAppelOffre = jest.fn(() => ({ isSoumisAuxGF: false } as ProjectAppelOffre))
      const onAnnulationAbandonAccordée = makeOnAnnulationAbandonAccordée({
        projectRepo,
        publishToEventStore,
        getProjectAppelOffre,
      })

      await onAnnulationAbandonAccordée(événemement)

      expect(publishToEventStore).toHaveBeenCalledTimes(1)

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AbandonProjetAnnulé',
          payload: {
            projetId,
            dateAchèvement: new Date(completionDueOn),
            dateLimiteEnvoiDcr: dcrDueOn,
          },
        })
      )
    })
  })
})
