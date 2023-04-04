import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain';
import { logger, okAsync } from '@core/utils';
import { GetProjectAppelOffre } from '@modules/projectAppelOffre';
import { DonnéesDeRaccordementRenseignées, ProjectCompletionDueDateSet } from '../events';
import { Project } from '../Project';
import { add } from 'date-fns';

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
};

export const makeOnDonnéesDeRaccordementRenseignées =
  ({ projectRepo, publishToEventStore, getProjectAppelOffre }: Dépendances) =>
  ({ payload }: DonnéesDeRaccordementRenseignées) => {
    const { projetId } = payload;
    if (!('dateMiseEnService' in payload)) {
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
        if (
          cahierDesCharges.type !== 'modifié' ||
          cahierDesCharges.paruLe !== '30/08/2022' ||
          délaiCDC2022appliqué
        ) {
          return okAsync(null);
        }
        const projectAppelOffre = getProjectAppelOffre({
          appelOffreId,
          periodeId,
          familleId,
        });
        if (!projectAppelOffre) {
          logger.error(
            `project eventHandler onDonnéesDeRaccordementRenseignées : AO non trouvé. Projet ${projetId}`,
          );
          return okAsync(null);
        }
        const donnéesCDC =
          projectAppelOffre.cahiersDesChargesModifiésDisponibles &&
          projectAppelOffre.cahiersDesChargesModifiésDisponibles.find(
            (CDC) =>
              CDC.type === 'modifié' &&
              CDC.paruLe === '30/08/2022' &&
              CDC.alternatif === cahierDesCharges.alternatif,
          );
        if (!donnéesCDC || !donnéesCDC.délaiApplicable) {
          logger.error(
            `project eventHandler onDonnéesDeRaccordementRenseignées : données CDC modifié non trouvées. Projet ${projetId}`,
          );
          return okAsync(null);
        }
        if (
          payload.dateMiseEnService.getTime() <
            new Date(donnéesCDC.délaiApplicable.intervaleDateMiseEnService.min).getTime() ||
          payload.dateMiseEnService.getTime() >
            new Date(donnéesCDC.délaiApplicable.intervaleDateMiseEnService.max).getTime()
        ) {
          return okAsync(null);
        }

        const nouvelleDate = add(new Date(completionDueOn), {
          months: donnéesCDC.délaiApplicable.délaiEnMois,
        });

        return publishToEventStore(
          new ProjectCompletionDueDateSet({
            payload: {
              projectId: projetId,
              completionDueOn: nouvelleDate.getTime(),
              reason: 'délaiCdc2022',
            },
          }),
        );
      },
    );
  };
