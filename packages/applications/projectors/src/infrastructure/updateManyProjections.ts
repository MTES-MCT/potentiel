import format from 'pg-format';

import { Entity, WhereOptions } from '@potentiel-domain/entity';
import { flatten } from '@potentiel-libraries/flat';
import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { getWhereClause } from '@potentiel-infrastructure/pg-projections';

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

/** */
export const updateManyProjections = async <TEntity extends Entity>(
  category: TEntity['type'],
  where: WhereOptions<Omit<TEntity, 'type'>>,
  update: AtLeastOne<Omit<TEntity, 'type'>>,
): Promise<void> => {
  const [updateQuery, values] = getUpdateProjectionQuery(category, where, update);
  console.log({ updateQuery, values });
  await executeQuery(updateQuery, ...values);
};

export const getUpdateProjectionQuery = <TEntity extends Entity>(
  category: TEntity['type'],
  where: WhereOptions<Omit<TEntity, 'type'>>,
  update: AtLeastOne<Omit<TEntity, 'type'>>,
): [string, Array<unknown>] => {
  const flatReadModel = flatten(update) as Record<string, unknown>;

  const [whereClause, whereValues] = where ? getWhereClause(where) : ['', []];

  /*
    The following generates a recursive update similar to this:
    select jsonb_set(jsonb_set(data,'{field1}','"new_value1"'), '{field2}', '"new_value2"')
    from (select '{"field1": "a", "field2":"b"}'::jsonb as data ) a

    the `i+2` operation is due to `i` starting at 0, and $1 being the key
   */
  const jsonb_set = Object.keys(flatReadModel).reduce(
    (acc, curr, i) => `jsonb_set(${acc},'{${format('%I', curr)}}',$${i + 2 + whereValues.length})`,
    'value',
  );
  const values = Object.values(flatReadModel).map((value) =>
    typeof value === 'string' ? `"${value}"` : value,
  );

  return [
    `update domain_views.projection set value=${jsonb_set} where key like $1 ${whereClause}`,
    [`${category}|%`, ...whereValues, ...values],
  ];
};
