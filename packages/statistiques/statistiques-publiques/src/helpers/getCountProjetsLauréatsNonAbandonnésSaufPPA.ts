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
    LEFT JOIN domain_views.projection ppa ON ppa.key = format(
      'power-purchase-agreement|%s',
      lau.value ->> 'identifiantProjet'
    )
  WHERE
    lau.key LIKE 'lauréat|%'
    AND (
      lau.value->>'statut' <> 'abandonné'
      OR ppa.key IS NOT NULL
    )
    ${cycle ? `AND ao.value->>'cycleAppelOffre' = '${cycle}'` : ''}
`;
