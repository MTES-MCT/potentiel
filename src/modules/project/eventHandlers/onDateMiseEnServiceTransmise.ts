import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { err, logger, okAsync, ResultAsync } from '../../../core/utils';
import { GetProjectAppelOffre } from '../../projectAppelOffre';
import { DateMiseEnServiceTransmise, ProjectCompletionDueDateSet } from '../events';
import { Project } from '../Project';
import { FindProjectByIdentifiers, RécupérerDétailDossiersRaccordements } from '../queries';

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
  findProjectByIdentifiers: FindProjectByIdentifiers;
  récupérerDétailDossiersRaccordements: RécupérerDétailDossiersRaccordements;
};

export const makeOnDateMiseEnServiceTransmise =
  ({
    projectRepo,
    publishToEventStore,
    getProjectAppelOffre,
    findProjectByIdentifiers,
    récupérerDétailDossiersRaccordements,
  }: Dépendances) =>
  ({ payload }: DateMiseEnServiceTransmise) => {
    const { identifiantProjet, dateMiseEnService, référenceDossierRaccordement } = payload;
    const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');

    return ResultAsync.fromPromise(
      récupérerDétailDossiersRaccordements({
        appelOffre,
        période,
        famille,
        numéroCRE,
      }),
      () => {
        logger.error(
          `project eventHandler onDateMiseEnServiceTransmise : erreur lors de la lecture des dossiers de raccordement. Projet ${identifiantProjet}`,
        );
        return okAsync(null);
      },
    )
      .andThen((raccordements) => {
        if (!raccordements) {
          logger.error(
            `project eventHandler onDateMiseEnServiceTransmise : raccordements non trouvés. Projet ${identifiantProjet}`,
          );
          return okAsync(null);
        }
        if (
          raccordements.find(
            (dossier) =>
              !dossier.miseEnService && dossier.référence !== référenceDossierRaccordement,
          )
        ) {
          return okAsync(null);
        }

        return findProjectByIdentifiers({
          appelOffreId: appelOffre,
          periodeId: période,
          familleId: famille,
          numeroCRE: numéroCRE,
        });
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
                `project eventHandler onDateMiseEnServiceTransmise : AO non trouvé. Projet ${projetId}`,
              );
              return okAsync(null);
            }

            const donnéesCDC = projectAppelOffre.periode.cahiersDesChargesModifiésDisponibles.find(
              (CDC) =>
                CDC.type === 'modifié' &&
                CDC.paruLe === '30/08/2022' &&
                CDC.alternatif === cahierDesCharges.alternatif,
            );

            if (!donnéesCDC) {
              logger.error(
                `project eventHandler onDateMiseEnServiceTransmise : données CDC modifié non trouvées. Projet ${projetId}`,
              );
              return okAsync(null);
            }

            if (!donnéesCDC.délaiApplicable) {
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
