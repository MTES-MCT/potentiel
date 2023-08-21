import { AbandonAccordé } from '../../demandeModification';
import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { Project, ProjectAbandoned } from '..';

type MakeOnAbandonAccordéProps = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
};

type OnAbandonAccordéProps = AbandonAccordé;

export const makeOnAbandonAccordé =
  ({ projectRepo, publishToEventStore }: MakeOnAbandonAccordéProps) =>
  ({ payload: { projetId: projectId, accordéPar } }: OnAbandonAccordéProps) =>
    projectRepo.transaction(new UniqueEntityID(projectId), () => {
      return publishToEventStore(
        new ProjectAbandoned({
          payload: {
            projectId,
            abandonAcceptedBy: accordéPar,
          },
        }),
      );
    });
