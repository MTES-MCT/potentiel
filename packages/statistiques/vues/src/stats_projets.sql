DROP VIEW IF EXISTS domain_views.stats_projets;
CREATE VIEW domain_views.stats_projets AS --
-- Liste des projets en service
WITH projets_en_service as (
  select distinct p.value->>'identifiantProjet' as id
  from domain_views.projection p
  where p.key like 'dossier-raccordement|%'
    and p.value->>'miseEnService.dateMiseEnService' is not null
)
SELECT proj.value->>'identifiantProjet' AS id,
  SPLIT_PART(proj.value->>'identifiantProjet', '#', 1) as "appelOffre",
  SPLIT_PART(proj.value->>'identifiantProjet', '#', 2)::float as "periode",
  SPLIT_PART(proj.value->>'identifiantProjet', '#', 3) as "famille",
  SPLIT_PART(proj.value->>'identifiantProjet', '#', 4) as "numeroCRE",
  COALESCE(
    proj.value->>'nomProjet',
    cand.value->>'nomProjet'
  ) AS "nomProjet",
  cand.value->>'nomCandidat' AS "nomCandidat",
  cand.value->>'technologieCalculée' AS "technologie",
  COALESCE(
    proj.value->>'localité.région',
    cand.value->>'localité.région'
  ) AS region,
  COALESCE(
    proj.value->>'localité.département',
    cand.value->>'localité.département'
  ) AS departement,
  (cand.value->'prixReference')::float as prix,
  COALESCE(
    puiss.value->>'puissance',
    cand.value->>'puissance'
  )::float as puissance,
  cand.value->>'unitéPuissance' as "unitePuissance",
  CAST(proj.value->>'notifiéLe' as timestamp) AS "dateNotification",
  CAST(ach.value->>'prévisionnel.date' as timestamp) AS "dateAchevementPrevisionnel",
  CAST(ach.value->>'réel.date' as timestamp) AS "dateAchevementReel",
  CASE
    WHEN proj.key like 'éliminé|%' THEN 'éliminé'
    WHEN aban.key is NOT NULL THEN 'abandonné'
    WHEN ach.value->>'estAchevé' = 'true' THEN 'achevé'
    ELSE 'actif'
  END AS statut,
  projets_en_service.id is not null as "enService",
  cand.value->>'actionnariat' as "typeActionnariat",
  COALESCE(
    four.value->'évaluationCarboneSimplifiée',
    cand.value->'evaluationCarboneSimplifiée'
  )::float as "evaluationCarbone"
FROM domain_views.projection proj
  INNER JOIN domain_views.projection cand on cand.key = format(
    'candidature|%s',
    proj.value->>'identifiantProjet'
  )
  LEFT JOIN domain_views.projection puiss on puiss.key = format(
    'puissance|%s',
    proj.value->>'identifiantProjet'
  )
  LEFT JOIN domain_views.projection four on four.key = format(
    'fournisseur|%s',
    proj.value->>'identifiantProjet'
  )
  LEFT JOIN domain_views.projection ach on ach.key = format(
    'achèvement|%s',
    proj.value->>'identifiantProjet'
  )
  LEFT JOIN domain_views.projection aban on aban.key = format(
    'abandon|%s',
    proj.value->>'identifiantProjet'
  )
  and aban.value->>'estAbandonné' = 'true'
  LEFT JOIN projets_en_service on projets_en_service.id = proj.value->>'identifiantProjet'
WHERE proj.key LIKE 'lauréat|%'
  OR proj.key LIKE 'éliminé|%';
