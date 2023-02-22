import { AnnulationAbandonAccordée } from '@modules/demandeModification';
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain';
import { AbandonProjetAnnulé, Project, ProjectGFDueDateSet } from '@modules/project';
import add from 'date-fns/add';
import { okAsync } from 'neverthrow';
import { GetProjectAppelOffre } from '@modules/projectAppelOffre';
import { logger } from '@core/utils';

type Evènement = AnnulationAbandonAccordée;

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
};

export const makeOnAnnulationAbandonAccordée =
  ({ projectRepo, publishToEventStore, getProjectAppelOffre }: Dépendances) =>
  ({ payload: { projetId } }: Evènement) =>
    projectRepo.transaction(
      new UniqueEntityID(projetId),
      ({ completionDueOn, dcrDueOn, notifiedOn, appelOffreId, periodeId, familleId }) =>
        publishToEventStore(
          new AbandonProjetAnnulé({
            payload: {
              projetId,
              dateAchèvement: new Date(completionDueOn),
              dateLimiteEnvoiDcr: dcrDueOn,
            },
          }),
        ).andThen(() => {
          const appelOffreProjet = getProjectAppelOffre({ appelOffreId, periodeId, familleId });
          if (!appelOffreProjet) {
            logger.error(
              `onAnnulationAbandonAccordée n'a pas pu retrouver l'appel d'offres du projet ${projetId}`,
            );
            return okAsync(null);
          }

          if (!appelOffreProjet.isSoumisAuxGF) {
            return okAsync(null);
          }

          return publishToEventStore(
            new ProjectGFDueDateSet({
              payload: {
                projectId: projetId,
                garantiesFinancieresDueOn: add(new Date(notifiedOn), {
                  months: 2,
                }).getTime(),
              },
            }),
          );
        }),
    );
