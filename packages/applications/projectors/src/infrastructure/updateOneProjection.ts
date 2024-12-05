import format from 'pg-format';

import { Entity } from '@potentiel-domain/entity';
import { flatten } from '@potentiel-libraries/flat';
import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { getLogger } from '@potentiel-libraries/monitoring';

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

/** */
export const updateOneProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
  readModel: AtLeastOne<Omit<TProjection, 'type'>>,
): Promise<void> => {
  const [updateQuery, values] = getUpdateClause(readModel, 1);
  const result = await executeQuery(`${updateQuery} where key = $1`, id, ...values);
  if (result.rowCount === 0) {
    getLogger('Projectors.infrastructure.updateOneProjection').warn(
      "La projection mise à jour n'existe pas",
    );
  }
};

/**
 * Generates a recursive update similar to this:
 * select jsonb_set(jsonb_set(data,'{field1}','"new_value1"'), '{field2}', '"new_value2"')
 * from (select '{"field1": "a", "field2":"b"}'::jsonb as data ) a
 *
 * startIndex allows to shift the variable ($1,...)
 */
export const getUpdateClause = <TProjection extends Entity>(
  readModel: AtLeastOne<Omit<TProjection, 'type'>>,
  startIndex: number,
): [string, Array<unknown>] => {
  const flatReadModel = flatten(readModel) as Record<string, unknown>;

  // add 1 to startIndex since arrays start at 0 but sql variables start at $1
  const jsonb_set = Object.keys(flatReadModel).reduce(
    (acc, curr, i) => `jsonb_set(${acc},'{${format('%I', curr)}}',$${i + 1 + startIndex})`,
    'value',
  );
  const values = Object.values(flatReadModel).map((value) =>
    typeof value === 'string' ? `"${value}"` : value,
  );
  return [`update domain_views.projection set value=${jsonb_set}`, values];
};
