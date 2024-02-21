import { Projection } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel/pg-helpers';

/**
@deprecated Cette fonction sera bientôt remplacer par celle contenu dans le package @potentiel-application/bootstrap;
 */
export const createProjection = async <TProjection extends Projection>(
  id: `${TProjection['type']}|${string}`,
  readModel: Omit<TProjection, 'type'>,
): Promise<void> => {
  await executeQuery(`insert into domain_views.projection values($1, $2)`, id, readModel);
};
