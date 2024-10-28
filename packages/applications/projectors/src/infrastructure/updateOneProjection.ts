import format from 'pg-format';

import { Entity } from '@potentiel-domain/entity';
import { flatten } from '@potentiel-libraries/flat';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

/** */
export const updateOneProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
  readModel: AtLeastOne<Omit<TProjection, 'type'>>,
): Promise<void> => {
  const [updateQuery, values] = prepareUpdateProjectionQuery(readModel);
  await executeQuery(updateQuery, id, ...values);
};

export const prepareUpdateProjectionQuery = <TProjection extends Entity>(
  readModel: AtLeastOne<Omit<TProjection, 'type'>>,
): [string, Array<unknown>] => {
  const flatReadModel = flatten(readModel) as Record<string, unknown>;
  /*
    The following generates a recursive update similar to this:
    select jsonb_set(jsonb_set(data,'{field1}','"new_value1"'), '{field2}', '"new_value2"')
    from (select '{"field1": "a", "field2":"b"}'::jsonb as data ) a

    the `i+2` operation is due to `i` starting at 0, and $1 being the key
   */
  const jsonb_set = Object.keys(flatReadModel).reduce(
    (acc, curr, i) => `jsonb_set(${acc},'{${format('%I', curr)}}',$${i + 2})`,
    'value',
  );
  const values = Object.values(flatReadModel).map((value) =>
    typeof value === 'string' ? `"${value}"` : value,
  );
  return [`update domain_views.projection set value=${jsonb_set} where key = $1`, values];
};
