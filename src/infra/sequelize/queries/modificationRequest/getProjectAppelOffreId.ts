import { err, ok, wrapInfra } from '../../../../core/utils';
import { GetProjectAppelOffreId } from '../../../../modules/modificationRequest';
import { EntityNotFoundError } from '../../../../modules/shared';
import { Project } from '../../projectionsNext';

export const getProjectAppelOffreId: GetProjectAppelOffreId = (projectId) => {
  return wrapInfra(
    Project.findByPk(projectId, {
      attributes: ['appelOffreId'],
    }),
  ).andThen((projectRaw: any) => {
    if (!projectRaw) return err(new EntityNotFoundError());

    const { appelOffreId } = projectRaw.get();

    return ok(appelOffreId);
  });
};
