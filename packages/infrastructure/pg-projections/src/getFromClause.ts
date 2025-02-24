import format from 'pg-format';

import { Entity, JoinOptions } from '@potentiel-domain/entity';

type GetFromClauseOptions<
  TEntity extends Entity,
  TJoin extends Entity | {} = {},
> = TJoin extends Entity ? { join: JoinOptions<TEntity, TJoin> } : { join?: undefined };

export const getFromClause = <TEntity extends Entity, TJoin extends Entity | {} = {}>({
  join,
}: GetFromClauseOptions<TEntity, TJoin>): string => {
  const baseClause = 'from domain_views.projection p1';

  if (join) {
    const joinClause = getJoinClause(join);
    return `${baseClause} ${joinClause}`;
  }
  return baseClause;
};

const getJoinClause = <TEntity extends Entity>(join: JoinOptions<TEntity, Entity>) =>
  format(
    `inner join domain_views.projection p2 on p2.key=format('%s|%%%%s', p1.value->>%L)`,
    join.entityType,
    join.key,
  );
