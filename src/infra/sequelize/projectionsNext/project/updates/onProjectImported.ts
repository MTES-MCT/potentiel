import { logger } from '@core/utils';
import { ProjectImported } from '@modules/project';
import { ProjectProjector, Project } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

// TODO: Projection migrée en l'état, Project étant typé à any dans l'implémentation initiale, il manque des champs obligatoire lors de la création.
export const onProjectImported = ProjectProjector.on(
  ProjectImported,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, data, potentielIdentifier },
      } = évènement;
      await Project.create(
        {
          id: projectId,
          ...data,
          evaluationCarboneDeRéférence: data.evaluationCarbone,
          potentielIdentifier,
        } as any,
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectImported`,
          {
            évènement,
            nomProjection: 'Project.ProjectImported',
          },
          error,
        ),
      );
    }
  },
);
