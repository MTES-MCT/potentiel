
import { UniqueEntityID } from '../../../../../core/domain';
import { logger } from '../../../../../core/utils';
import { ProjectImported } from '../../../../../modules/project';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(ProjectImported, async (évènement, transaction) => {
  const {
    payload: {
      projectId,
      data: { notifiedOn, classe },
    },
    occurredAt,
  } = évènement;
  try {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectImported.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { notifiedOn },
      },
      { transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectImported (projectEvent.update) : ajout de ProjectImported`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onProjectImported',
        },
        error,
      ),
    );
  }

  if (classe === 'Classé') {
    try {
      await ProjectEvent.create(
        {
          projectId,
          type: 'DateMiseEnService',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          id: new UniqueEntityID().toString(),
          payload: { statut: 'non-renseignée' },
        },
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectImported (projectEvent.update) : ajout de DateMiseEnService`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onProjectImported',
          },
          error,
        ),
      );
    }
  }
});
