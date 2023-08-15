import { logger } from '../../../../../core/utils';
import { ProjectGFRemoved } from '../../../../../modules/project';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { EventHandler } from '../../eventHandler';
import { GarantiesFinancières } from '../garantiesFinancières.model';

export const onProjectGFRemoved: EventHandler<ProjectGFRemoved> = async (
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
        `Erreur lors du traitement de l'évènement ProjectGFRemoved : ligne non trouvée`,
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
        fichierId: null,
        dateEnvoi: null,
        envoyéesPar: null,
        dateConstitution: null,
        validéesLe: null,
        validéesPar: null,
        statut: 'en attente',
      },
      { where: { projetId, id: entréeExistante.id }, transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectGFRemoved : création d'une nouvelle entrée`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
        error,
      ),
    );
  }
};
