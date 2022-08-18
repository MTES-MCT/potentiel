import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { ResultAsync } from '@core/utils'
import { AccordDemandeDélaiAnnulé } from '@modules/demandeModification'
import { Project, ProjectCompletionDueDateSet } from '@modules/project'
import { InfraNotAvailableError } from '@modules/shared'

type OnAccordDemandeDélaiAnnulé = (
  event: AccordDemandeDélaiAnnulé
) => ResultAsync<null, InfraNotAvailableError>

type MakeOnAccordDemandeDélaiAnnulé = (dépendances: {
  projectRepo: TransactionalRepository<Project>
  publishToEventStore: EventStore['publish']
}) => OnAccordDemandeDélaiAnnulé

export const makeOnAccordDemandeDélaiAnnulé: MakeOnAccordDemandeDélaiAnnulé =
  ({ projectRepo, publishToEventStore }) =>
  ({ payload: { projetId: projectId, annuléPar, nouvelleDateAchèvement } }) => {
    return projectRepo.transaction(new UniqueEntityID(projectId), (project) => {
      return publishToEventStore(
        new ProjectCompletionDueDateSet({
          payload: {
            projectId,
            setBy: annuléPar,
            completionDueOn: new Date(nouvelleDateAchèvement).getTime(),
          },
        })
      )
    })
  }
