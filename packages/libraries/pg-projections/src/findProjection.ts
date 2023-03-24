import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModel } from '@potentiel/core-domain';
import { none, Option } from '@potentiel/monads';

export const findProjection = async <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}#${string}`,
): Promise<Option<Omit<TReadModel, 'type'>>> => {
  const result = await executeSelect<{ value: TReadModel }>(
    `SELECT "value" FROM "PROJECTION" where "key" = $1`,
    id,
  );

  if (result.length !== 1) {
    return none;
  }

  return result[0].value;
};
