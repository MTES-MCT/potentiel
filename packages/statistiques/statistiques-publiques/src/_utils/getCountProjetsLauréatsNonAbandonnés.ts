export const getCountProjetsLauréatsNonAbandonnés = `
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
    AND abandon.value->>'statut' = 'accordé'
  WHERE lau.key like 'lauréat|%'
    AND abandon.key IS NULL`;

export const getCountProjetsLauréatsNonAbandonnésParCycle = `
  ${getCountProjetsLauréatsNonAbandonnés}
    AND ao.value->>'cycleAppelOffre' = $2
`;
