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
  WHERE lau.key like 'lauréat|%'
    AND lau.value->>'statut' <> 'abandonné'
    ${cycle ? `AND ao.value->>'cycleAppelOffre' = '${cycle}'` : ''}
    `;
