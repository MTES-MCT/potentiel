import { logger } from '../../../../../core/utils';
import { DateEchéanceGarantiesFinancièresSupprimée } from '../../../../../modules/project';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { EventHandler } from '../../eventHandler';

export const onDateEchéanceGarantiesFinancièresSupprimée: EventHandler<
  DateEchéanceGarantiesFinancièresSupprimée
> = async (évènement, transaction) => {
  const {
    payload: { projectId: projetId },
  } = évènement;

  const entréeExistante = await GarantiesFinancières.findOne({
    where: { projetId },
    transaction,
  });

  if (entréeExistante) {
    try {
      entréeExistante.dateEchéance = null;
      await entréeExistante.save();
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement DateEchéanceGarantiesFinancièresSupprimée : mise à jour de l'entrée GF du projet`,
          {
            évènement,
            nomProjection: 'GarantiesFinancières',
          },
          error,
        ),
      );
    }
  }
  return;
};
