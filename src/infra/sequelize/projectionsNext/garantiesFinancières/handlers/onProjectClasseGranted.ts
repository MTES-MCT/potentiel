import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { UniqueEntityID } from '@core/domain';
import { logger } from '@core/utils';
import { ProjectClasseGranted } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { Project } from '../../project/project.model';
import { EventHandler } from '../../eventHandler';

export const onProjectClasseGranted: EventHandler<ProjectClasseGranted> = async (
  évènement,
  transaction,
) => {
  const {
    payload: { projectId: projetId },
  } = évènement;

  const project = await Project.findOne({
    where: { id: projetId },
    transaction,
  });

  const appelOffre =
    project &&
    getProjectAppelOffre({
      appelOffreId: project.appelOffreId,
      periodeId: project.periodeId,
      familleId: project.familleId,
    });

  if (!appelOffre) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectClasseGranted: AO non trouvé`,
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

  const entréeExistante = await GarantiesFinancières.findOne({ where: { projetId }, transaction });

  try {
    await GarantiesFinancières.upsert(
      {
        id: entréeExistante ? entréeExistante.id : new UniqueEntityID().toString(),
        projetId,
        statut: 'en attente',
        soumisesALaCandidature,
      },
      { transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectClasseGranted`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
        error,
      ),
    );
  }
};
