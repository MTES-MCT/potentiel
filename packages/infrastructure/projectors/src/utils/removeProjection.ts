import { Projection } from '@potentiel-libraries/projection';
import { executeQuery } from '@potentiel/pg-helpers';

export const removeProjection = async <TProjection extends Projection>(
  id: `${TProjection['type']}|${string}`,
): Promise<void> => {
  await executeQuery(`delete from domain_views.projection where key = $1`, id);
};
