import { logger } from '@core/utils';
import { ProjectGFDueDateSet } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model';
import { UniqueEntityID } from '@core/domain';
import models from '../../../models';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';

export default GarantiesFinancièresProjector.on(
  ProjectGFDueDateSet,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId, garantiesFinancieresDueOn },
    } = évènement;

    const entréeExistante = await GarantiesFinancières.findOne({
      where: { projetId },
      transaction,
    });

    if (entréeExistante) {
      try {
        await GarantiesFinancières.update(
          {
            dateLimiteEnvoi: new Date(garantiesFinancieresDueOn),
          },
          { where: { projetId }, transaction },
        );
      } catch (error) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'évènement ProjectGFDueDateSet : mise à jour de l'entrée GF du projet`,
            {
              évènement,
              nomProjection: 'GarantiesFinancières',
            },
            error,
          ),
        );
      }
      return;
    }

    try {
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
            `Erreur lors du traitement de l'évènement ProjectGFDueDateSet : AO non trouvé`,
            {
              évènement,
              nomProjection: 'GarantiesFinancières',
            },
          ),
        );
      }

      await GarantiesFinancières.create(
        {
          id: new UniqueEntityID().toString(),
          projetId,
          soumisesALaCandidature:
            appelOffre?.famille?.soumisAuxGarantiesFinancieres === 'à la candidature' ||
            appelOffre?.soumisAuxGarantiesFinancieres === 'à la candidature',
          dateLimiteEnvoi: new Date(garantiesFinancieresDueOn),
          statut: 'en attente',
        },
        { where: { projetId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFDueDateSet : création d'une nouvelle entrée`,
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
