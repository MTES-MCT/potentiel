import format from 'pg-format';
import { flatten } from 'flat';

import { Entity } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { getLogger } from '@potentiel-libraries/monitoring';
import { getWhereClause } from '@potentiel-infrastructure/pg-projection-read';

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export const updateOneProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
  readModel: DeepPartial<Omit<TProjection, 'type'>>,
): Promise<void> => {
  const [updateClause, updateValues] = getUpdateClause(readModel, 1);
  const [whereClause, whereValues] = getWhereClause({ key: { operator: 'equal', value: id } });
  const result = await executeQuery(
    `${updateClause} ${whereClause}`,
    ...whereValues,
    ...updateValues,
  );
  if (result.rowCount === 0) {
    getLogger('Projectors.infrastructure.updateOneProjection').warn(
      "La projection à mettre à jour n'existe pas",
      { id },
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
  readModel: DeepPartial<Omit<TProjection, 'type'>>,
  startIndex: number,
): [string, Array<unknown>] => {
  const flatReadModel = flatten(readModel, { safe: true }) as Record<string, unknown>;

  // add 1 to startIndex since arrays start at 0 but sql variables start at $1
  const jsonb_set = Object.entries(flatReadModel)
    .filter(([, value]) => value !== undefined)
    .reduce(
      (acc, [key], i) => `jsonb_set(${acc},'{${format('%I', key)}}',$${i + 1 + startIndex})`,
      'value',
    );

  const unsetFields = Object.entries(flatReadModel)
    .filter(([, value]) => value === undefined)
    .map(([key]) => format('%I', key));

  // Unset values that are undefined using the `-` operator :
  // select value - {field1, field2}::text[] from domain_views.projection
  const jsonb_unset = unsetFields.length > 0 ? ` - '{${unsetFields.join(',')}}'::text[]` : '';

  const values = Object.values(flatReadModel)
    .map((value) =>
      typeof value === 'object'
        ? JSON.stringify(value)
        : typeof value === 'string'
          ? toJsonbString(value)
          : value,
    )
    .filter((value) => typeof value !== 'undefined');

  return [`update domain_views.projection p set value=${jsonb_set}${jsonb_unset}`, values];
};

const toJsonbString = (value: string) => {
  const escaped = value
    .replaceAll('"', `\\"`)
    .replaceAll('\n', `\\n`)
    .replaceAll('\r', `\\r`)
    .replaceAll('\t', `\\t`);
  return `"${escaped}"`;
};
