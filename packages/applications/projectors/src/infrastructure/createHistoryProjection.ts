import { HistoryRecord } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

const insertQuery = 'insert into domain_views.history values($1, $2, $3, $4, $5)';

export const createHistoryProjection = async ({
  category,
  createdAt,
  id,
  payload,
  type,
}: HistoryRecord): Promise<void> => {
  await executeQuery(insertQuery, category, id, createdAt, type, payload);
};
