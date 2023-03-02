import { logger } from '@core/utils';
import { ProjectClaimedByOwner } from '@modules/projectClaim/events';
import { EntityNotFoundError } from '@modules/shared';

export const onProjectClaimedByOwner = (models) => async (event: ProjectClaimedByOwner) => {
  const { projectId, claimerEmail } = event.payload;
  const { Project } = models;

  try {
    const project = await Project.findByPk(projectId);

    if (project === null) {
      throw new EntityNotFoundError();
    }

    project.email = claimerEmail;

    await project.save();
  } catch (e) {
    logger.error(e);
  }
};
