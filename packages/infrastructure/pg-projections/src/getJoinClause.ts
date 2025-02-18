import format from 'pg-format';

import { Entity, JoinOptions } from '@potentiel-domain/entity';

export const getJoinClause = <TEntity extends Entity>(join: JoinOptions<TEntity, Entity>) =>
  format(
    ` inner join domain_views.projection p2 on p2.key=format('%s|%%%%s', p1.value->>%L)`,
    join.projection,
    join.key,
  );
