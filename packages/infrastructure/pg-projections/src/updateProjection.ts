import { Projection } from '@potentiel-libraries/projection';
import { executeQuery } from '@potentiel/pg-helpers';

/**
 * @deprecated Cette fonction sera bientôt remplacer par celle contenu dans le package @potentiel-infrastructure/projectors
 * et ne sera plus exposer
 */
export const updateProjection = async <TProjection extends Projection>(
  id: `${TProjection['type']}|${string}`,
  readModel: Omit<TProjection, 'type'>,
): Promise<void> => {
  await executeQuery(`update domain_views.projection set value=$2 where key = $1`, id, readModel);
};
