DROP VIEW IF EXISTS domain_private_statistic.laureat;

CREATE VIEW domain_private_statistic.laureat AS
SELECT
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 1) END) AS appel_offre,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 2) END) AS periode,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 3) END) AS famille,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 4) END) AS numero_cre,

    -- notifié
    MAX(CASE WHEN j.key = 'notifiéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS notifie_le,
    MAX(CASE WHEN j.key = 'notifiéPar' THEN j.value END) AS notifie_par,

    -- nomProjet
    MAX(CASE WHEN j.key = 'nomProjet' THEN j.value END) AS nom_projet,

    -- localité
    MAX(CASE WHEN j.key = 'localité.adresse1' THEN j.value END) AS localite_adresse1,
    MAX(CASE WHEN j.key = 'localité.adresse2' THEN j.value END) AS localite_adresse2,
    MAX(CASE WHEN j.key = 'localité.codePostal' THEN j.value END) AS localite_code_postal,
    MAX(CASE WHEN j.key = 'localité.commune' THEN j.value END) AS localite_commune,
    MAX(CASE WHEN j.key = 'localité.région' THEN j.value END) AS localite_région,
    MAX(CASE WHEN j.key = 'localité.département' THEN j.value END) AS localite_département
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'lauréat|%'
GROUP BY t.key;