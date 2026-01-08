DROP VIEW IF EXISTS domain_views.stats_demandes;

CREATE VIEW domain_views.stats_demandes AS -- 
--
-- Abandon
SELECT VALUE->>'identifiantProjet' AS id,
  'abandon' AS categorie,
  CAST(VALUE->>'demande.demandéLe' AS timestamp) AS demande,
  CAST(
    VALUE->>'demande.accord.accordéLe' AS timestamp
  ) AS accord,
  CAST(VALUE->>'demande.rejet.rejetéLe' AS timestamp) AS rejet,
  value->>'statut' as statut
FROM domain_views.projection
WHERE KEY LIKE 'demande-abandon|%'
UNION
--
-- Recours
-- A TESTER, car pas en prod au moment de l'écriture
SELECT VALUE->>'identifiantProjet' AS id,
  'recours' AS categorie,
  CAST(VALUE->>'demande.demandéLe' AS timestamp) AS demande,
  CAST(
    VALUE->>'demande.accord.accordéLe' AS timestamp
  ) AS accord,
  CAST(VALUE->>'demande.rejet.rejetéLe' AS timestamp) AS rejet,
  value->>'statut' as statut
FROM domain_views.projection
WHERE KEY LIKE 'demande-recours|%'
UNION
--
-- Délai
SELECT VALUE->>'identifiantProjet' AS id,
  'délai' AS categorie,
  CAST(VALUE->>'demandéLe' AS timestamp) AS demande,
  CAST(VALUE->>'accord.accordéeLe' AS timestamp) AS accord,
  CAST(VALUE->>'rejet.rejetéeLe' AS timestamp) AS rejet,
  value->>'statut' as statut
FROM domain_views.projection
WHERE KEY LIKE 'demande-délai|%'
UNION
--
-- Puissance
SELECT VALUE->>'identifiantProjet' AS id,
  'puissance' AS categorie,
  CAST(VALUE->>'demande.demandéeLe' AS timestamp) AS demande,
  CAST(
    VALUE->>'demande.accord.accordéeLe' AS timestamp
  ) AS accord,
  CAST(VALUE->>'demande.rejet.rejetéeLe' AS timestamp) AS rejet,
  value->>'demande.statut' as statut
FROM domain_views.projection
WHERE KEY LIKE 'changement-puissance|%'
UNION
--
-- Actionnaire
SELECT VALUE->>'identifiantProjet' AS id,
  'actionnaire' AS categorie,
  CAST(VALUE->>'demande.demandéeLe' AS timestamp) AS demande,
  CAST(
    VALUE->>'demande.accord.accordéeLe' AS timestamp
  ) AS accord,
  CAST(VALUE->>'demande.rejet.rejetéLe' AS timestamp) AS rejet,
  value->>'demande.statut' as statut
FROM domain_views.projection
WHERE KEY LIKE 'changement-actionnaire|%'
UNION
--
-- Représentant légal
SELECT VALUE->>'identifiantProjet' AS id,
  'représentant-légal' AS categorie,
  CAST(VALUE->>'demande.demandéLe' AS timestamp) AS demande,
  CAST(
    VALUE->>'demande.accord.accordéLe' AS timestamp
  ) AS accord,
  CAST(VALUE->>'demande.rejet.rejetéLe' AS timestamp) AS rejet,
  value->>'demande.statut' as statut
FROM domain_views.projection
WHERE KEY LIKE 'changement-représentant-légal|%'
UNION
--
--  Producteur
SELECT VALUE->>'identifiantProjet' AS id,
  'producteur' AS categorie,
  CAST(VALUE->>'changement.enregistréLe' AS timestamp) AS demande,
  NULL AS accord,
  NULL AS rejet,
  'information-enregistrée' as statut
FROM domain_views.projection
WHERE KEY LIKE 'changement-producteur|%'
UNION
--
--  Fournisseur
SELECT VALUE->>'identifiantProjet' AS id,
  'fournisseur' AS categorie,
  CAST(VALUE->>'changement.enregistréLe' AS timestamp) AS demande,
  NULL AS accord,
  NULL AS rejet,
  'information-enregistrée' as statut
FROM domain_views.projection
WHERE KEY LIKE 'changement-fournisseur|%';