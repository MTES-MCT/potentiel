import { Projection } from '@potentiel-libraries/projection';
import { executeQuery } from '@potentiel/pg-helpers';

/**
 * @deprecated Cette fonction sera bientôt remplacer par celle contenu dans le package @potentiel-infrastructure/projectors
 * et ne sera plus exposer
 */
export const removeProjectionByCategory = async <TProjection extends Projection>(
  category: `${TProjection['type']}`,
): Promise<void> => {
  await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
};
