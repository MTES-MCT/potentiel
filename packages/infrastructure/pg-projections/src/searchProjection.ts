import { executeSelect } from '@potentiel/pg-helpers';
import { KeyValuePair } from './keyValuePair';
import { Projection } from '@potentiel-libraries/projection';

export const searchProjection = async <TProjection extends Projection>(
  searchKeyExpression: string,
): Promise<
  ReadonlyArray<{
    key: string;
    readModel: TProjection;
  }>
> => {
  const query = `select key, value from domain_views.projection where key like $1`;

  const result = await executeSelect<KeyValuePair<TProjection['type'], TProjection>>(
    query,
    searchKeyExpression,
  );

  return result.map(({ key, value }) => ({
    key,
    readModel: {
      type: key.split('|')[0],
      ...value,
    } as TProjection,
  }));
};
