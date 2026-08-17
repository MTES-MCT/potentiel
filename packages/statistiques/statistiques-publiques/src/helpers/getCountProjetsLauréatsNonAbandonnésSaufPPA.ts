import type { Cycle } from './cycle.type.js';

export const getCountProjetsLauréatsNonAbandonnésSaufPPA = (cycle?: Cycle) => `
  SELECT
    count(*)
  FROM
    domain_views.projection lau
    INNER JOIN domain_views.projection ao ON ao.key = format(
      'appel-offre|%s',
      SPLIT_PART(lau.value ->> 'identifiantProjet', '#', 1)
    )
    LEFT JOIN domain_views.projection abandon ON abandon.key = format('abandon|%s', lau.value ->> 'identifiantProjet')
    AND abandon.value ->> 'estAbandonné' = 'true'
    LEFT JOIN domain_views.projection ppa ON ppa.key = format(
      'power-purchase-agreement|%s',
      lau.value ->> 'identifiantProjet'
    )
  WHERE
    lau.key LIKE 'lauréat|%'
    AND (
      abandon.key IS NULL
      OR ppa.key IS NOT NULL
    )
    ${cycle ? `AND ao.value->>'cycleAppelOffre' = '${cycle}'` : ''}
`;
