DROP VIEW IF EXISTS domain_private_statistic.éliminé;

CREATE VIEW domain_private_statistic.éliminé AS
SELECT
    -- identifiantProjet 
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    
    -- notifié
    MAX(CASE WHEN j.key = 'notifiéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS notifié_le,
    MAX(CASE WHEN j.key = 'notifiéPar' THEN j.value END) AS notifié_par
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'éliminé|%'
GROUP BY t.key;