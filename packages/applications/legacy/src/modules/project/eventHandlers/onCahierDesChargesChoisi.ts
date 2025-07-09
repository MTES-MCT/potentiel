import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { logger, okAsync, ResultAsync } from '../../../core/utils';
import { GetProjectAppelOffre } from '../../projectAppelOffre';
import { CahierDesChargesChoisi, ProjectCompletionDueDateSet } from '../events';
import { Project } from '../Project';
import { RécupérerDétailDossiersRaccordements } from '../queries';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../helpers/dataToValueTypes';

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
  récupérerDétailDossiersRaccordements: RécupérerDétailDossiersRaccordements;
};

export const makeOnCahierDesChargesChoisi =
  ({
    projectRepo,
    publishToEventStore,
    getProjectAppelOffre,
    récupérerDétailDossiersRaccordements,
  }: Dépendances) =>
  ({ payload }: CahierDesChargesChoisi) => {
    const { projetId, type } = payload;
    return projectRepo.transaction(
      new UniqueEntityID(projetId),
      ({
        appelOffreId,
        periodeId,
        familleId,
        cahierDesCharges,
        délaiCDC2022appliqué,
        completionDueOn,
        data,
      }) => {
        const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
          appelOffreId,
          periodeId,
          familleId,
          numeroCRE: data!.numeroCRE,
        });

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
        )?.délaiApplicable;

        if (!délaiCDC2022appliqué) {
          if (type !== 'modifié' || payload.paruLe !== '30/08/2022') {
            return okAsync(null);
          }
          // le porteur choisit le CDC 2022, et le délai n'est pas déjà appliqué
          return ResultAsync.fromPromise(
            récupérerDétailDossiersRaccordements(identifiantProjet),
            () => {
              logger.error(
                `project eventHandler onCahierDesChargesChoisi : erreur lors de la lecture des dossiers de raccordement. Projet ${projetId}`,
              );
              return okAsync(null);
            },
          ).andThen((raccordements) => {
            if (raccordements.length === 0) {
              logger.error(
                `project eventHandler onCahierDesChargesChoisi : raccordements non trouvés. Projet ${projetId}`,
              );
              return okAsync(null);
            }

            if (!délaiCDC2022Applicable) {
              return okAsync(null);
            }

            return raccordements.find(
              (dossier) =>
                !dossier.miseEnService ||
                isDateHorsIntervalle({
                  dateMiseEnService: dossier.miseEnService?.dateMiseEnService?.formatter() || '',
                  min: new Date(délaiCDC2022Applicable.intervaleDateMiseEnService.min),
                  max: new Date(délaiCDC2022Applicable.intervaleDateMiseEnService.max),
                }),
            )
              ? okAsync(null)
              : /**
                 * @achevement
                 * Supprimer l'envoi de l'event ci-dessous et utiliser DatePrévisionnelleCalculée à la place !
                 */
                publishToEventStore(
                  new ProjectCompletionDueDateSet({
                    payload: {
                      projectId: projetId,
                      completionDueOn: new Date(
                        new Date(completionDueOn).setMonth(
                          new Date(completionDueOn).getMonth() + délaiCDC2022Applicable.délaiEnMois,
                        ),
                      ).getTime(),
                      reason: 'délaiCdc2022',
                    },
                  }),
                );
          });
        } else {
          if (type === 'modifié' && payload.paruLe === '30/08/2022') {
            return okAsync(null);
          }

          if (!délaiCDC2022Applicable) {
            logger.error(
              `project eventHandler onCahierDesChargesChoisi : pas de délai CDC 2022 applicable trouvé alors que le projet a bénéficié du délai. Projet ${projetId}`,
            );
            return okAsync(null);
          }

          /**
           * @achevement
           * Supprimer l'envoi de l'event ci-dessous et utiliser DatePrévisionnelleCalculée à la place !
           */
          // délai déjà appliqué et le porteur choisit un CDC autre que 2022
          return publishToEventStore(
            new ProjectCompletionDueDateSet({
              payload: {
                projectId: projetId,
                completionDueOn: new Date(
                  new Date(completionDueOn).setMonth(
                    new Date(completionDueOn).getMonth() - délaiCDC2022Applicable.délaiEnMois,
                  ),
                ).getTime(),
                reason: 'ChoixCDCAnnuleDélaiCdc2022',
              },
            }),
          );
        }
      },
    );

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
