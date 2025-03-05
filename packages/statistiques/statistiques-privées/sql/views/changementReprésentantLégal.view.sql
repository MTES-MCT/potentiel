DROP VIEW IF EXISTS domain_private_statistic.représentantLégal;

CREATE VIEW domain_private_statistic.représentantLégal AS
SELECT
    -- identifiantProjet 
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    
    -- nomReprésentantLégal
    MAX(CASE WHEN j.key = 'nomReprésentantLégal' THEN j.value END) AS nom_représentant_légal,
    
    -- typeReprésentantLégal
    MAX(CASE WHEN j.key = 'typeReprésentantLégal' THEN j.value END) AS type_représentant_légal,

    -- demandeEnCours
    MAX(CASE WHEN j.key = 'demandeEnCours.demandéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_en_cours_demandé_le
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'représentant-légal|%'
GROUP BY t.key;