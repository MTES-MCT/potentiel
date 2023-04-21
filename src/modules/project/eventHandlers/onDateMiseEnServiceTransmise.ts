import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain';
import { logger, okAsync } from '@core/utils';
import { GetProjectAppelOffre } from '@modules/projectAppelOffre';
import { ProjectCompletionDueDateSet } from '../events';
import { Project } from '../Project';
import { DateMiseEnServiceTransmiseEvent } from '@potentiel/domain';
import { Project as ProjectModel } from '@infra/sequelize/projectionsNext';

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
};

export const makeOnDateMiseEnServiceTransmise =
  ({ projectRepo, publishToEventStore, getProjectAppelOffre }: Dépendances) =>
  async ({ payload }: DateMiseEnServiceTransmiseEvent) => {
    const { identifiantProjet, dateMiseEnService } = payload;
    console.log(identifiantProjet);
    const [appelOffre, famille = '', période, numéroCRE] = identifiantProjet.split('#');

    const projet = await ProjectModel.findOne({
      where: {
        appelOffreId: appelOffre,
        periodeId: période,
        familleId: famille,
        numeroCRE: numéroCRE,
      },
      attributes: ['id'],
    });

    if (!projet) {
      return;
    }

    return projectRepo.transaction(
      new UniqueEntityID(projet.id),
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
            `project eventHandler onDonnéesDeRaccordementRenseignées : AO non trouvé. Projet ${projet.id}`,
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
            `project eventHandler onDonnéesDeRaccordementRenseignées : données CDC modifié non trouvées. Projet ${projet.id}`,
          );
          return okAsync(null);
        }
        if (
          new Date(dateMiseEnService).getTime() <
            new Date(donnéesCDC.délaiApplicable.intervaleDateMiseEnService.min).getTime() ||
          new Date(dateMiseEnService).getTime() >
            new Date(donnéesCDC.délaiApplicable.intervaleDateMiseEnService.max).getTime()
        ) {
          return okAsync(null);
        }
        const nouvelleDate = new Date(
          new Date(completionDueOn).setMonth(
            new Date(completionDueOn).getMonth() + donnéesCDC.délaiApplicable.délaiEnMois,
          ),
        );

        return publishToEventStore(
          new ProjectCompletionDueDateSet({
            payload: {
              projectId: projet.id,
              completionDueOn: nouvelleDate.getTime(),
              reason: 'délaiCdc2022',
            },
          }),
        );
      },
    );
  };
