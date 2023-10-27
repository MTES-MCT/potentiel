import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { logger, okAsync } from '../../../core/utils';
import { GetProjectAppelOffre } from '../../projectAppelOffre';
import { DemandeComplèteRaccordementTransmise, ProjectCompletionDueDateSet } from '../events';
import { Project } from '../Project';
import { FindProjectByIdentifiers } from '../queries';

type Dépendances = {
  projectRepo: TransactionalRepository<Project>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
  findProjectByIdentifiers: FindProjectByIdentifiers;
};

export const makeOnDemandeComplèteRaccordementTransmise =
  ({
    projectRepo,
    publishToEventStore,
    getProjectAppelOffre,
    findProjectByIdentifiers,
  }: Dépendances) =>
  ({ payload }: DemandeComplèteRaccordementTransmise) => {
    const { identifiantProjet } = payload;
    const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');
    return findProjectByIdentifiers({
      appelOffreId: appelOffre,
      periodeId: période,
      familleId: famille,
      numeroCRE: numéroCRE,
    }).andThen((projectId) => {
      if (!projectId) {
        logger.error(
          `project eventHandler onDemandeComplèteRaccordementTransmise : projet legacy id non trouvés. Projet ${identifiantProjet}`,
        );
        return okAsync(null);
      }

      return projectRepo.transaction(
        new UniqueEntityID(projectId),
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
          const délaiCDCApplicable = getProjectAppelOffre({
            appelOffreId,
            periodeId,
            familleId,
          })?.periode.cahiersDesChargesModifiésDisponibles.find(
            (CDC) =>
              CDC.type === cahierDesCharges.type &&
              CDC.paruLe === cahierDesCharges.paruLe &&
              CDC.alternatif === cahierDesCharges.alternatif,
          )?.délaiApplicable;

          if (!délaiCDCApplicable) {
            logger.error(
              `project eventHandler onDemandeComplèteRaccordementTransmise : pas de délai applicable trouvé alors que délai déjà appliqué. Projet ${identifiantProjet}`,
            );
            return okAsync(null);
          }

          return publishToEventStore(
            new ProjectCompletionDueDateSet({
              payload: {
                projectId,
                completionDueOn: new Date(
                  new Date(completionDueOn).setMonth(
                    new Date(completionDueOn).getMonth() - délaiCDCApplicable.délaiEnMois,
                  ),
                ).getTime(),
                reason: 'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022',
              },
            }),
          );
        },
      );
    });
  };
