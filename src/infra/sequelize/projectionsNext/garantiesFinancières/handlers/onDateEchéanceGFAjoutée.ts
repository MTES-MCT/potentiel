import { logger } from '@core/utils';
import { DateEchéanceGFAjoutée } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { EventHandler } from '../../eventHandler';
import { GarantiesFinancières } from '../garantiesFinancières.model';

export const onDateEchéanceGFAjoutée: EventHandler<DateEchéanceGFAjoutée> = async (
  évènement,
  transaction,
) => {
  const {
    payload: { projectId: projetId, expirationDate },
  } = évènement;

  const entréeExistante = await GarantiesFinancières.findOne({
    where: { projetId },
    transaction,
  });

  if (!entréeExistante) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement DateEchéanceGFAjoutée : ligne non trouvée`,
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
        dateEchéance: expirationDate,
      },
      { where: { projetId }, transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement DateEchéanceGFAjoutée :mise à jour date échéance`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
        error,
      ),
    );
  }
};
