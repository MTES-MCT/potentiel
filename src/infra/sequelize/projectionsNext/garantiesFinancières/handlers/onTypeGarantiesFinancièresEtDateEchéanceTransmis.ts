import { UniqueEntityID } from '../../../../../core/domain';
import { logger } from '../../../../../core/utils';
import { TypeGarantiesFinancièresEtDateEchéanceTransmis } from '../../../../../modules/project';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { EventHandler } from '../../eventHandler';

export const onTypeGarantiesFinancièresEtDateEchéanceTransmis: EventHandler<
  TypeGarantiesFinancièresEtDateEchéanceTransmis
> = async (évènement, transaction) => {
  const {
    payload: { projectId: projetId, type, dateEchéance },
  } = évènement;

  const entréeExistante = await GarantiesFinancières.findOne({
    where: { projetId },
    transaction,
  });

  try {
    await GarantiesFinancières.upsert(
      {
        id: entréeExistante ? entréeExistante.id : new UniqueEntityID().toString(),
        projetId,
        statut: entréeExistante ? entréeExistante.statut : 'en attente',
        soumisesALaCandidature: true,
        type,
        ...(dateEchéance && { dateEchéance: new Date(dateEchéance) }),
      },
      { transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement TypeGarantiesFinancièresEtDateEchéanceTransmis`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
        error,
      ),
    );
  }
};
