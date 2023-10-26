import { Projection } from '@potentiel-libraries/projection';
import { executeQuery } from '@potentiel/pg-helpers';

/**
 * @deprecated Cette fonction sera bientôt remplacer par celle contenu dans le package @potentiel-infrastructure/projectors
 * et ne sera plus exposer
 */
export const upsertProjection = async <TProjection extends Projection>(
  id: `${TProjection['type']}|${string}`,
  readModel: Omit<TProjection, 'type'>,
): Promise<void> => {
  await executeQuery(
    `
    insert into domain_views.projection 
    values($1, $2)
    on conflict (key) 
    do update set value=$2`,
    id,
    readModel,
  );
};
