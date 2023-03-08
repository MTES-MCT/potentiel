import { logger } from '@core/utils';
import { ProjectGFRemoved } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
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

  await GarantiesFinancières.destroy({ where: { projetId }, transaction });

  try {
    await GarantiesFinancières.create(
      {
        id: entréeExistante.id,
        projetId,
        soumisesALaCandidature: entréeExistante.soumisesALaCandidature,
        ...(entréeExistante.dateLimiteEnvoi && {
          dateLimiteEnvoi: entréeExistante.dateLimiteEnvoi,
        }),
        statut: 'en attente',
      },
      { transaction },
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
