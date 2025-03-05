DROP VIEW IF EXISTS domain_private_statistic.changement_actionnaire;

CREATE VIEW domain_private_statistic.changement_actionnaire AS
SELECT
    -- identifiantProjet 
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    
    -- demande
    MAX(CASE WHEN j.key = 'demande.nouvelActionnaire' THEN j.value END) AS demande_nouvel_actionnaire,
    MAX(CASE WHEN j.key = 'demande.statut' THEN j.value END) AS demande_statut,
    MAX(CASE WHEN j.key = 'demande.demandéePar' THEN j.value END) AS demande_demandée_par,
    MAX(CASE WHEN j.key = 'demande.demandéeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_demandée_le,
    MAX(CASE WHEN j.key = 'demande.raison' THEN j.value END) AS demande_raison,
    MAX(CASE
          WHEN j.key = 'demande.pièceJustificative'
              THEN 1
              ELSE 0
          END
    )::BOOLEAN AS demande_a_une_piece_justificative,

    -- accord
    MAX(CASE
            WHEN j.key = 'demande.accord'
                THEN 1
                ELSE 0
            END
    )::BOOLEAN AS demande_a_un_accord,
    MAX(CASE WHEN j.key = 'accord.accordéePar' THEN j.value END) AS accord_accordee_par,
    MAX(CASE WHEN j.key = 'accord.accordéeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS accord_accordee_le,

    -- rejet
    MAX(CASE
            WHEN j.key = 'demande.rejet'
                THEN 1
                ELSE 0
            END
    )::BOOLEAN AS demande_a_un_rejet,
    MAX(CASE WHEN j.key = 'rejet.rejetéePar' THEN j.value END) AS rejet_rejetee_par,
    MAX(CASE WHEN j.key = 'rejet.rejetéeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS rejet_rejetee_le
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'changement-actionnaire|%'
GROUP BY t.key;