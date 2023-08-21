import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { logger, okAsync, err } from '../../../core/utils';
import { GetProjectAppelOffre } from '../../projectAppelOffre';
import { DateMiseEnServiceTransmise, ProjectCompletionDueDateSet } from '../events';
import { Project } from '../Project';
import { FindProjectByIdentifiers } from '../queries';

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
  findProjectByIdentifiers: FindProjectByIdentifiers;
};

export const makeOnDateMiseEnServiceTransmise =
  ({
    projectRepo,
    publishToEventStore,
    getProjectAppelOffre,
    findProjectByIdentifiers,
  }: Dépendances) =>
  ({ payload }: DateMiseEnServiceTransmise) => {
    const { identifiantProjet, dateMiseEnService } = payload;
    const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');

    return findProjectByIdentifiers({
      appelOffreId: appelOffre,
      periodeId: période,
      familleId: famille,
      numeroCRE: numéroCRE,
    })
      .andThen((projetId) => {
        if (!projetId) {
          return err(new Error(`Projet non trouvé`));
        }
        return okAsync(projetId);
      })
      .andThen((projetId) => {
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

            const cahiersDesChargesModifiésDisponibles =
              projectAppelOffre?.periode &&
              'cahiersDesChargesModifiésDisponibles' in projectAppelOffre?.periode
                ? projectAppelOffre?.periode.cahiersDesChargesModifiésDisponibles
                : projectAppelOffre?.cahiersDesChargesModifiésDisponibles;

            const donnéesCDC =
              cahiersDesChargesModifiésDisponibles &&
              cahiersDesChargesModifiésDisponibles.find(
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
                  projectId: projetId,
                  completionDueOn: nouvelleDate.getTime(),
                  reason: 'délaiCdc2022',
                },
              }),
            );
          },
        );
      });
  };
