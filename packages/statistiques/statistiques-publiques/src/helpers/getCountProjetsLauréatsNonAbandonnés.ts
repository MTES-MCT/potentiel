import type { Cycle } from './cycle.type.js';

export const getCountProjetsLauréatsNonAbandonnés = (cycle?: Cycle) => `
  SELECT 
    count(*)
  FROM 
    domain_views.projection lau
  INNER JOIN 
    domain_views.projection ao on ao.key = format(
      'appel-offre|%s',
      SPLIT_PART(lau.value->>'identifiantProjet', '#', 1)
    )
  LEFT JOIN domain_views.projection abandon 
    ON abandon.key = format('abandon|%s', lau.value->>'identifiantProjet')
    AND abandon.value->>'estAbandonné' = 'true'
  WHERE lau.key like 'lauréat|%'
    AND abandon.key IS NULL 
    ${cycle ? `AND ao.value->>'cycleAppelOffre' = '${cycle}'` : ''}
    `;
