import { ChangementDePuissanceAccordé } from '@modules/demandeModification'
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { Project, ProjectPuissanceUpdated } from '@modules/project'

type MakeOnChangementDePuissanceAccordéProps = {
  projectRepo: TransactionalRepository<Project>
  publishToEventStore: EventStore['publish']
}

type OnChangementDePuissanceAccordéProps = ChangementDePuissanceAccordé

export const makeOnChangementDePuissanceAccordé =
  ({ projectRepo, publishToEventStore }: MakeOnChangementDePuissanceAccordéProps) =>
  ({
    payload: { projetId: projectId, accordéPar: updatedBy, nouvellePuissance },
  }: OnChangementDePuissanceAccordéProps) =>
    projectRepo.transaction(new UniqueEntityID(projectId), () =>
      publishToEventStore(
        new ProjectPuissanceUpdated({
          payload: {
            projectId,
            newPuissance: nouvellePuissance,
            updatedBy,
          },
        })
      )
    )
