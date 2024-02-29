import { UniqueEntityID } from '../../../../../core/domain';
import { logger } from '../../../../../core/utils';
import { TypeGarantiesFinancièresEtDateEchéanceTransmis } from '../../../../../modules/project';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { EventHandler } from '../../eventHandler';
import { getProjectAppelOffre } from '../../../../../config/queryProjectAO.config';
import { Project } from '../../project/project.model';

export const onTypeGarantiesFinancièresEtDateEchéanceTransmis: EventHandler<
  TypeGarantiesFinancièresEtDateEchéanceTransmis
> = async (évènement, transaction) => {
  const {
    payload: { projectId: projetId, type, dateEchéance },
  } = évènement;

  const projet = await Project.findByPk(projetId, { transaction });

  if (!projet) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement TypeGarantiesFinancièresEtDateEchéanceTransmis: projet non trouvé`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
      ),
    );
    return;
  }
  const { appelOffreId, periodeId, familleId } = projet;
  const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });

  if (!appelOffre) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement TypeGarantiesFinancièresEtDateEchéanceTransmis: AO non trouvé`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
      ),
    );
    return;
  }

  if (!appelOffre.isSoumisAuxGF) {
    return;
  }

  const soumisesALaCandidature =
    appelOffre.famille?.soumisAuxGarantiesFinancieres === 'à la candidature' ||
    appelOffre.soumisAuxGarantiesFinancieres === 'à la candidature';

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
        soumisesALaCandidature,
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
