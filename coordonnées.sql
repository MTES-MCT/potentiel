-- Lister les clés des champs de détaeil
SELECT 
  --p.key AS projection_key,
  distinct kv.key AS field_name 
  --kv.value AS field_value
FROM domain_views.projection p
  CROSS JOIN LATERAL jsonb_each(p.value) AS kv(key, value)
WHERE p.key LIKE 'détail-candidature|%'
  and kv.key like '%barycentre%'
order by 1;

-- Supprimer tous les champs de coordonnées pour reset
update event_store.event_stream
set payload = payload - 'coordonnées'
where payload->>'coordonnées' is not null;


-- 
--  Nettoyage des clés de détails
-- 
UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Latitude (degrés)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)';


UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Latitude (minutes)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)';

UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Latitude (secondes)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)';


UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Latitude (cardinal)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)';




UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (degrés)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude (degrés)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude (degrés)';


UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (degrés)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (degrés)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (degrés)';


UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (degrés)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84du barycentre de l''Installation : Longitude (degrés)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84du barycentre de l''Installation : Longitude (degrés)';


UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (minutes)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude (minutes)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude (minutes)';


UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (minutes)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (minutes)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (minutes)';

UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (minutes)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84du barycentre de l''Installation : Longitude (minutes)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84du barycentre de l''Installation : Longitude (minutes)';

UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (secondes)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (secondes)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (secondes)';

UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (secondes)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84du barycentre de l''Installation : Longitude (secondes)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84du barycentre de l''Installation : Longitude (secondes)';

UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (secondes)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude (secondes)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude (secondes)';



UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (cardinal)"}',
    payload->'détail'->'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (cardinal)'
  )
WHERE payload->'détail' ? 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (cardinal)';





-- AOS
UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (cardinal)"}',
    payload->'détail'->'Longitude du barycentre (point cardinal)'
  )
WHERE payload->'détail' ? 'Longitude du barycentre (point cardinal)';

UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (degrés)"}',
    payload->'détail'->'Longitude du barycentre (degrés)'
  )
WHERE payload->'détail' ? 'Longitude du barycentre (degrés)';

UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (minutes)"}',
    payload->'détail'->'Longitude du barycentre (minutes)'
  )
WHERE payload->'détail' ? 'Longitude du barycentre (minutes)';

UPDATE event_store.event_stream
SET payload = jsonb_set(
    payload,
    '{détail,"Coordonnées géodésiques WGS84 du barycentre de l''Installation : Longitude (secondes)"}',
    payload->'détail'->'Longitude du barycentre (secondes)'
  )
WHERE payload->'détail' ? 'Longitude du barycentre (secondes)';
