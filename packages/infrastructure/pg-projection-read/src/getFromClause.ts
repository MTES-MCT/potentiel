import format from 'pg-format';

import type { Entity, JoinOptions } from '@potentiel-domain/entity';

type GetFromClauseParams = {
  joins: Array<JoinOptions<Entity, Entity>>;
  search?: string;
};

export const getFromClause = ({ joins, search }: GetFromClauseParams): string => {
  const baseClause = 'from domain_views.projection p';

  const searchClause = search
    ? baseClause +
      format(" inner join domain_views.search_projects s on s.id = SPLIT_PART(p.key,'|',2)")
    : baseClause;

  return joins.reduce((clause, join) => {
    const joinClause = getJoinClause(join);
    return `${clause} ${joinClause}`;
  }, searchClause);
};

const getJoinClause = <TJoin extends Entity>(join: JoinOptions<Entity, TJoin>) =>
  format(
    `%s join domain_views.projection as %I on %s`,
    join.type === 'left' ? 'left' : 'inner',
    join.entity, // ... as "entityName"
    join.joinKey // ON clause
      ? format(
          "%I.key like '%s|%%' AND %I.value->>%L=p.value->>%L",
          join.entity, // "entityName".key
          join.entity, // like 'entityName|%'
          join.entity, // "entityName".value
          join.joinKey, // ->> JOIN_KEY
          join.on, // = p.value->>ON
        ) // on JOINED.key like 'JOINED-ENTITY|%' AND JOINED.value->>JOIN_KEY=p.value->>ON
      : format("%I.key=format('%s|%%%%s', p.value->>%L)", join.entity, join.entity, join.on), // on JOINED.key=format('JOINED-ENTITY|%s', p.value->>ON)
  );
