import { Projection } from '@potentiel-libraries/projection';
import { executeQuery } from '@potentiel/pg-helpers';

/**
 * @deprecated Cette fonction sera bientôt remplacer par celle contenu dans le package @potentiel-infrastructure/projectors
 * et ne sera plus exposer
 */
export const removeProjection = async <TProjection extends Projection>(
  id: `${TProjection['type']}|${string}`,
): Promise<void> => {
  await executeQuery(`delete from domain_views.projection where key = $1`, id);
};
