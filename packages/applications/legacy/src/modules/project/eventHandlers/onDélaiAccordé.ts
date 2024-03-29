import { DélaiAccordé } from '../../demandeModification';
import { ResultAsync } from '../../../core/utils';
import { InfraNotAvailableError } from '../../shared';
import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { Project, ProjectCompletionDueDateSet } from '..';

type OnDélaiAccordé = (event: DélaiAccordé) => ResultAsync<null, InfraNotAvailableError>;

type MakeOnDélaiAccordé = (dépendances: {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
}) => OnDélaiAccordé;

export const makeOnDélaiAccordé: MakeOnDélaiAccordé =
  ({ projectRepo, publishToEventStore }) =>
  ({ payload: { projetId: projectId, accordéPar, dateAchèvementAccordée } }) =>
    projectRepo.transaction(new UniqueEntityID(projectId), (project) =>
      publishToEventStore(
        new ProjectCompletionDueDateSet({
          payload: {
            projectId,
            setBy: accordéPar,
            completionDueOn: dateAchèvementAccordée.getTime(),
          },
        }),
      ),
    );
