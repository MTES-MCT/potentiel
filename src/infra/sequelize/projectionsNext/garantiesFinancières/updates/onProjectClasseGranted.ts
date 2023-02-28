import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { UniqueEntityID } from '@core/domain';
import { logger } from '@core/utils';
import { ProjectClasseGranted } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model';
import models from '../../../models';

export default GarantiesFinancièresProjector.on(
  ProjectClasseGranted,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId },
    } = évènement;

    const { Project } = models;

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

    await GarantiesFinancières.destroy({
      where: { projetId },
      transaction,
    });

    try {
      await GarantiesFinancières.create(
        {
          id: new UniqueEntityID().toString(),
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
  },
);
