import { DélaiAccordéCorrigé } from '../../demandeModification';
import { ResultAsync } from '../../../core/utils';
import { InfraNotAvailableError } from '../../shared';
import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { Project, ProjectCompletionDueDateSet } from '..';

type OnDélaiAccordéCorrigé = (
  event: DélaiAccordéCorrigé,
) => ResultAsync<null, InfraNotAvailableError>;

type MakeOnDélaiAccordéCorrigé = (dépendances: {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
}) => OnDélaiAccordéCorrigé;

export const makeOnDélaiAccordéCorrigé: MakeOnDélaiAccordéCorrigé =
  ({ projectRepo, publishToEventStore }) =>
  ({ payload: { projectLegacyId: projectId, corrigéPar, dateAchèvementAccordée } }) =>
    projectRepo.transaction(new UniqueEntityID(projectId), () =>
      publishToEventStore(
        new ProjectCompletionDueDateSet({
          payload: {
            projectId,
            setBy: corrigéPar,
            completionDueOn: new Date(dateAchèvementAccordée).getTime(),
          },
        }),
      ),
    );
