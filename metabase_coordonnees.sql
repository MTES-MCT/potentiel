-- 
-- Ce fichier est destiné à être utilisé dans Metabase pour visualiser les coordonnées géographiques des projets. 
--
SELECT cand.VALUE->>'identifiantProjet' AS id,
  (cand.VALUE->>'coordonnées.latitude')::numeric AS latitude,
  (cand.VALUE->>'coordonnées.longitude')::numeric AS longitude,
  cand.VALUE->>'nomProjet' AS nom_projet,
  cand.VALUE->>'localité.commune' AS commune,
  cand.VALUE->>'localité.région' AS region,
  cand.VALUE->>'localité.département' AS departement,
  (detail.value->>'détail.Coordonnées géodésiques WGS84 du barycentre de l''Installation : Latitude (degrés)') ||
  (detail.value->>'détail.Coordonnées géodésiques WGS84 du barycentre de l''Installation : Latitude (minutes)') || 
  (detail.value->>'détail.Coordonnées géodésiques WGS84 du barycentre de l''Installation : Latitude (secondes)') ||
  (detail.value->>'détail.Coordonnées géodésiques WGS84 du barycentre de l''Installation : Latitude (cardinal)') as lat_raw,
  (detail.value->>'détail.Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (degrés)') ||
  (detail.value->>'détail.Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (minutes)') ||
  (detail.value->>'détail.Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (secondes)') || 
  (detail.value->>'détail.Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (cardinal)') as long_raw
FROM domain_views.projection cand
  INNER JOIN domain_views.projection detail ON detail.key = format(
    'détail-candidature|%s',
    cand.VALUE->>'identifiantProjet'
  )
  INNER JOIN domain_views.stats_projets p ON p.id = cand.VALUE->>'identifiantProjet'
WHERE cand.KEY LIKE 'candidature|%'
  AND (cand.VALUE->>'coordonnées.latitude') IS NOT NULL
  AND (cand.VALUE->>'coordonnées.longitude') IS NOT NULL
  AND {{ region }}
  AND {{ appel_offre }}
  AND {{ periode }}
  AND (
    ({{ showFrance }})
    OR (
      -- exclude france
      NOT (
        (cand.VALUE->>'coordonnées.latitude')::numeric BETWEEN 41.38714969029247 AND 51.16607536455569
        AND (cand.VALUE->>'coordonnées.longitude')::numeric BETWEEN -5.319010392763403 AND 10.340706410771872
      ) --   -- guadeloupe/martinique
      AND NOT (
        (cand.VALUE->>'coordonnées.latitude')::numeric BETWEEN 14.008651735985293 AND 16.582879099249485
        AND (cand.VALUE->>'coordonnées.longitude')::numeric BETWEEN -61.94829951371423 AND -60.772998911524155
      ) --   --guyane
      AND NOT (
        (cand.VALUE->>'coordonnées.latitude')::numeric BETWEEN 4.554078530900136 AND 5.779443081302479
        AND (cand.VALUE->>'coordonnées.longitude')::numeric BETWEEN -54.1 AND -51.95692564816386
      )
      AND NOT (
        (cand.VALUE->>'coordonnées.latitude')::numeric BETWEEN -13.03338878992189 AND -12.653873315426369
        AND (cand.VALUE->>'coordonnées.longitude')::numeric BETWEEN 45.001542043069094 AND 45.34337326879506
      )
      AND NOT (
        (cand.VALUE->>'coordonnées.latitude')::numeric BETWEEN -21.515453350447338 AND -20.687088411208098
        AND (cand.VALUE->>'coordonnées.longitude')::numeric BETWEEN 55.093741413650264 AND 55.95503755325444
      )
    )
  );
