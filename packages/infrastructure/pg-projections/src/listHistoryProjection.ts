import { ListHistoryOptions, ListHistoryResult } from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const countQuery =
  'SELECT COUNT(*) as total FROM domain_views.history WHERE (category = $1 or $1 is null) and (id = $2 or $2 is null)';
const selectQuery =
  'SELECT category, id, created_at, type, payload FROM domain_views.history WHERE (category = $1 or $1 is null) and (id = $2 or $2 is null) order by created_at desc';

export const listHistoryProjection = async (
  options?: ListHistoryOptions,
): Promise<ListHistoryResult> => {
  const [{ total }] = await executeSelect<{ total: number }>(
    countQuery,
    options?.category,
    options?.id,
  );

  const results = await executeSelect<{
    category: string;
    id: string;
    created_at: string;
    type: string;
    payload: Record<string, unknown>;
  }>(selectQuery, options?.category, options?.id);

  return {
    range: options?.range ?? {
      endPosition: total,
      startPosition: 0,
    },
    total,
    items: results.map(({ category, created_at, id, payload, type }) => ({
      category,
      id,
      createdAt: created_at,
      payload,
      type,
    })),
  };
};
