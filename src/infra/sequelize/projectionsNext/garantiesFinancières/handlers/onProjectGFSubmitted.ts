import { logger } from '@core/utils';
import { ProjectGFSubmitted } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { Project } from '../../project/project.model';
import { UniqueEntityID } from '@core/domain';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { EventHandler } from '../../eventHandler';

export const onProjectGFSubmitted: EventHandler<ProjectGFSubmitted> = async (
  évènement,
  transaction,
) => {
  const {
    occurredAt,
    payload: { projectId: projetId, fileId, submittedBy, expirationDate, gfDate },
  } = évènement;

  const entréeExistante = await GarantiesFinancières.findOne({
    where: { projetId },
    transaction,
  });

  if (entréeExistante) {
    try {
      await GarantiesFinancières.update(
        {
          fichierId: fileId,
          statut: 'à traiter',
          envoyéesPar: submittedBy,
          ...(expirationDate && { dateEchéance: expirationDate }),
          dateEnvoi: occurredAt,
          dateConstitution: gfDate,
        },
        { where: { projetId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFSubmitted : mise à jour de l'entrée GF du projet`,
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
          `Erreur lors du traitement de l'évènement ProjectGFSubmitted : AO non trouvé`,
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
        fichierId: fileId,
        statut: 'à traiter',
        envoyéesPar: submittedBy,
        ...(expirationDate && { dateEchéance: expirationDate }),
        dateEnvoi: occurredAt,
        dateConstitution: gfDate,
      },
      { where: { projetId }, transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectGFSubmitted : création d'une nouvelle entrée`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
        error,
      ),
    );
  }
};
