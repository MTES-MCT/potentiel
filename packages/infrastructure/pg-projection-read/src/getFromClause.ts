import format from 'pg-format';

import { Entity, JoinOptions } from '@potentiel-domain/entity';

type GetFromClauseParams = {
  joins: Array<JoinOptions<Entity, Entity>>;
};

export const getFromClause = ({ joins }: GetFromClauseParams): string => {
  const baseClause = 'from domain_views.projection p';

  if (joins.length === 0) return baseClause;

  return joins.reduce((clause, join) => {
    const joinClause = getJoinClause(join);
    return `${clause} ${joinClause}`;
  }, baseClause);
};

const getJoinClause = <TJoin extends Entity>(join: JoinOptions<Entity, TJoin>) =>
  format(
    `%s join domain_views.projection as %I on %I.key=format('%s|%%%%s', p.value->>%L)`,
    join.type === 'left' ? 'left' : 'inner',
    join.entity, // ... as "entityName"
    join.entity, // on "entityName".key=...
    join.entity, // format('%s|...', 'entityName')
    join.on,
  );
