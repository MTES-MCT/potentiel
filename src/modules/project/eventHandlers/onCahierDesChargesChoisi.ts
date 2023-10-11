import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { logger, okAsync } from '../../../core/utils';
import { GetProjectAppelOffre } from '../../projectAppelOffre';
import { CahierDesChargesChoisi, ProjectCompletionDueDateSet } from '../events';
import { Project } from '../Project';

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
};

export const makeOnCahierDesChargesChoisi =
  ({ projectRepo, publishToEventStore, getProjectAppelOffre }: Dépendances) =>
  ({ payload }: CahierDesChargesChoisi) => {
    const { projetId, type } = payload;
    if (type === 'modifié' && payload.paruLe === '30/08/2022') {
      return okAsync(null);
    }

    return projectRepo.transaction(
      new UniqueEntityID(projetId),
      ({
        appelOffreId,
        periodeId,
        familleId,
        cahierDesCharges,
        délaiCDC2022appliqué,
        completionDueOn,
      }) => {
        if (!délaiCDC2022appliqué) {
          return okAsync(null);
        }

        const délaiCDC2022Applicable = getProjectAppelOffre({
          appelOffreId,
          periodeId,
          familleId,
        })?.periode.cahiersDesChargesModifiésDisponibles.find((CDC) =>
          'alternatif' in cahierDesCharges
            ? CDC.type === 'modifié' &&
              CDC.paruLe === '30/08/2022' &&
              CDC.alternatif === cahierDesCharges.alternatif
            : CDC.type === 'modifié' && CDC.paruLe === '30/08/2022',
        )?.délaiApplicable?.délaiEnMois;

        if (!délaiCDC2022Applicable) {
          logger.error(
            `project eventHandler onCahierDesChargesChoisi : pas de délai CDC 2022 applicable trouvé alors que le projet a bénéficié du délai. Projet ${projetId}`,
          );
          return okAsync(null);
        }

        return publishToEventStore(
          new ProjectCompletionDueDateSet({
            payload: {
              projectId: projetId,
              completionDueOn: new Date(
                new Date(completionDueOn).setMonth(
                  new Date(completionDueOn).getMonth() - délaiCDC2022Applicable,
                ),
              ).getTime(),
              reason: 'délaiCdc2022Annulé',
            },
          }),
        );
      },
    );
  };
