import { AnnulationAbandonAccordée } from '../../demandeModification';
import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { AbandonProjetAnnulé, Project } from '..';

type Evènement = AnnulationAbandonAccordée;

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
};

export const makeOnAnnulationAbandonAccordée =
  ({ projectRepo, publishToEventStore }: Dépendances) =>
  ({ payload: { projetId } }: Evènement) =>
    projectRepo.transaction(new UniqueEntityID(projetId), ({ completionDueOn, dcrDueOn }) =>
      publishToEventStore(
        new AbandonProjetAnnulé({
          payload: {
            projetId,
            dateAchèvement: new Date(completionDueOn),
            dateLimiteEnvoiDcr: dcrDueOn,
          },
        }),
      ),
    );
