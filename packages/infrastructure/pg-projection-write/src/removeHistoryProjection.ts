import { executeQuery } from '@potentiel-libraries/pg-helpers';

const deleteQuery =
  'delete from domain_views.history where category = $1 and (id = $2 or $2 is null)';

export const removeHistoryProjection = async (category: string, id?: string): Promise<void> => {
  await executeQuery(deleteQuery, category, id);
};
