import { logger } from '@core/utils';
import { ProjectGFDueDateCancelled } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { EventHandler } from '../../eventHandler';
import { GarantiesFinancières } from '../garantiesFinancières.model';

export const onProjectGFDueDateCancelled: EventHandler<ProjectGFDueDateCancelled> = async (
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
        `Erreur lors du traitement de l'évènement ProjectGFDueDateCancelled : ligne non trouvée`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
      ),
    );
    return;
  }

  await GarantiesFinancières.destroy({ where: { projetId }, transaction });

  try {
    await GarantiesFinancières.create(
      {
        ...entréeExistante.dataValues,
        dateLimiteEnvoi: null,
      },
      { transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectGFDueDateCancelled : création d'une nouvelle entrée`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
        error,
      ),
    );
  }
};
