import { IdentifiantProjet } from '@potentiel-domain/projet';
import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { logger, okAsync, ResultAsync } from '../../../core/utils';
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
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    return ResultAsync.fromPromise(
      récupérerDétailDossiersRaccordements(identifiantProjetValueType),
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
        return okAsync(raccordements);
      })
      .andThen((raccordements) =>
        findProjectByIdentifiers({
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: identifiantProjetValueType.famille,
          numeroCRE: identifiantProjetValueType.numéroCRE,
        }).map((projetId) => ({ projetId, raccordements })),
      )
      .andThen(({ projetId, raccordements }) => {
        if (!projetId) {
          logger.error(
            `project eventHandler onDateMiseEnServiceTransmise : projet legacy id non trouvés. Projet ${identifiantProjet}`,
          );
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
            const délaiCDCApplicable = getProjectAppelOffre({
              appelOffreId,
              periodeId,
              familleId,
            })?.periode.cahiersDesChargesModifiésDisponibles.find((CDC) =>
              'alternatif' in cahierDesCharges
                ? CDC.type === 'modifié' &&
                  CDC.paruLe === '30/08/2022' &&
                  CDC.alternatif === cahierDesCharges.alternatif
                : CDC.type === 'modifié' && CDC.paruLe === '30/08/2022',
            )?.délaiApplicable;

            if (délaiCDC2022appliqué) {
              if (!délaiCDCApplicable) {
                logger.error(
                  `project eventHandler onDateMiseEnServiceTransmise : pas de délai applicable trouvé alors que délai déjà appliqué. Projet ${identifiantProjet}`,
                );
                return okAsync(null);
              }
              return isDateHorsIntervalle({
                dateMiseEnService,
                min: new Date(délaiCDCApplicable.intervaleDateMiseEnService.min),
                max: new Date(délaiCDCApplicable.intervaleDateMiseEnService.max),
              })
                ? publishToEventStore(
                    new ProjectCompletionDueDateSet({
                      payload: {
                        projectId: projetId,
                        completionDueOn: new Date(
                          new Date(completionDueOn).setMonth(
                            new Date(completionDueOn).getMonth() - délaiCDCApplicable.délaiEnMois,
                          ),
                        ).getTime(),
                        reason: 'DateMiseEnServiceAnnuleDélaiCdc2022',
                      },
                    }),
                  )
                : okAsync(null);
            } else {
              if (!délaiCDCApplicable) {
                return okAsync(null);
              }
              if (
                raccordements!.find(
                  (dossier) =>
                    (!dossier.miseEnService &&
                      dossier.référence.formatter() !== référenceDossierRaccordement) ||
                    (dossier.miseEnService &&
                      isDateHorsIntervalle({
                        dateMiseEnService:
                          dossier.miseEnService.dateMiseEnService?.formatter() || '',
                        min: new Date(délaiCDCApplicable.intervaleDateMiseEnService.min),
                        max: new Date(délaiCDCApplicable.intervaleDateMiseEnService.max),
                      })),
                )
              ) {
                return okAsync(null);
              }

              return !isDateHorsIntervalle({
                dateMiseEnService,
                min: new Date(délaiCDCApplicable.intervaleDateMiseEnService.min),
                max: new Date(délaiCDCApplicable.intervaleDateMiseEnService.max),
              }) &&
                cahierDesCharges.type === 'modifié' &&
                cahierDesCharges.paruLe === '30/08/2022'
                ? publishToEventStore(
                    new ProjectCompletionDueDateSet({
                      payload: {
                        projectId: projetId,
                        completionDueOn: new Date(
                          new Date(completionDueOn).setMonth(
                            new Date(completionDueOn).getMonth() + délaiCDCApplicable.délaiEnMois,
                          ),
                        ).getTime(),
                        reason: 'délaiCdc2022',
                      },
                    }),
                  )
                : okAsync(null);
            }
          },
        );
      });

    function isDateHorsIntervalle({
      dateMiseEnService,
      min,
      max,
    }: {
      dateMiseEnService: string;
      min: Date;
      max: Date;
    }) {
      return (
        new Date(dateMiseEnService).getTime() < new Date(min).getTime() ||
        new Date(dateMiseEnService).getTime() > new Date(max).getTime()
      );
    }
  };
