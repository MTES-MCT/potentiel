import { Option } from '@potentiel/monads';
import { Projection } from './projection';

export type Find = <TProjection extends Projection>(
  id: `${TProjection['type']}|${string}`,
) => Promise<Option<TProjection>>;
