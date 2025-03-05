DROP VIEW IF EXISTS domain_private_statistic.actionnaire;

CREATE VIEW domain_private_statistic.actionnaire AS
SELECT
    -- identifiantProjet 
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    
    -- actionnaire
    MAX(CASE WHEN j.key = 'actionnaire.nom' THEN j.value END) AS actionnaire_nom,
    MAX(CASE WHEN j.key = 'actionnaire.misÀJourLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS actionnaire_mis_a_jour_le,

    -- dateDemandeEnCours
    MAX(CASE WHEN j.key = 'dateDemandeEnCours' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS date_demande_en_cours
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'actionnaire|%'
GROUP BY t.key;