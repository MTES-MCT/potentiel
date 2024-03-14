import { UniqueEntityID } from '../../../../../core/domain';
import { logger } from '../../../../../core/utils';
import { ProjectReimported } from '../../../../../modules/project';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(ProjectReimported, async (évènement, transaction) => {
  const {
    payload: { projectId, data },
    occurredAt,
  } = évènement;

  if (!data.classe) {
    return;
  }

  if (data.classe === 'Classé') {
    const projectEvent = await ProjectEvent.findOne({
      where: { projectId, type: 'DateMiseEnService' },
      transaction,
    });

    if (projectEvent) {
      return;
    }

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
          `Erreur lors du traitement de l'évènement ProjectReimported (projectEvent.update) : ajout de DateMiseEnService`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onProjectReimported',
          },
          error,
        ),
      );
    }
    return;
  }

  if (data.classe === 'Eliminé') {
    await ProjectEvent.destroy({ where: { projectId, type: 'DateMiseEnService' }, transaction });
  }
});
