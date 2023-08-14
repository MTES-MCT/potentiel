import { logger } from '../../../../../core/utils';
import { ProjectGFWithdrawn } from '../../../../../modules/project';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { EventHandler } from '../../eventHandler';
import { GarantiesFinancières } from '../garantiesFinancières.model';

export const onProjectGFWithdrawn: EventHandler<ProjectGFWithdrawn> = async (
  évènement,
  transaction,
) => {
  const {
    payload: { projectId: projetId },
  } = évènement;

  const entréeExistante = await GarantiesFinancières.findOne({
    where: { projetId },
    transaction,
  });

  if (!entréeExistante) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectGFWithdrawn : ligne non trouvée`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
      ),
    );
    return;
  }

  try {
    await GarantiesFinancières.update(
      {
        dateEnvoi: null,
        dateConstitution: null,
        fichierId: null,
        envoyéesPar: null,
        validéesLe: null,
        validéesPar: null,
        statut: 'en attente',
      },
      { where: { projetId, id: entréeExistante.id }, transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectGFWithdrawn : création d'une nouvelle entrée`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
        error,
      ),
    );
  }
};
