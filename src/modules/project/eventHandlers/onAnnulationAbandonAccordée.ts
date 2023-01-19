import { AnnulationAbandonAccordée } from '@modules/demandeModification'
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { AbandonProjetAnnulé, Project } from '@modules/project'

type Evènement = AnnulationAbandonAccordée

type Dépendances = {
  projectRepo: TransactionalRepository<Project>
  publishToEventStore: EventStore['publish']
}

export const makeOnAnnulationAbandonAccordée =
  ({ projectRepo, publishToEventStore }: Dépendances) =>
  ({ payload: { projetId } }: Evènement) =>
    projectRepo.transaction(new UniqueEntityID(projetId), (projet) => {
      return publishToEventStore(
        new AbandonProjetAnnulé({
          payload: {
            projetId,
            dateAchèvement: new Date(projet.completionDueOn),
            dateLimiteEnvoiDcr: projet.dcrDueOn,
          },
        })
      )
    })
