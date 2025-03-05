DROP VIEW IF EXISTS domain_private_statistic.recours;

CREATE VIEW domain_private_statistic.recours AS
SELECT
    -- identifiantProjet 
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    
    -- statut
    MAX(CASE WHEN j.key = 'statut' THEN j.value END) AS statut,
    MAX(CASE WHEN j.key = 'misÀJourLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS mis_a_jour_le,

    -- demande
    MAX(CASE WHEN j.key = 'demande.raison' THEN j.value END) AS demande_raison,
    MAX(CASE WHEN j.key = 'demande.demandéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_demandé_le,
    MAX(CASE WHEN j.key = 'demande.demandéPar' THEN j.value END) AS demande_demandé_par,
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
    MAX(CASE WHEN j.key = 'accord.accordéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS accord_accordé_le,
    MAX(CASE WHEN j.key = 'accord.accordéPar' THEN j.value END) AS accord_accordé_par,

    -- rejet
    MAX(CASE
            WHEN j.key = 'demande.rejet'
                THEN 1
                ELSE 0
            END
    )::BOOLEAN AS demande_a_un_rejet,
    MAX(CASE WHEN j.key = 'rejet.rejetéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS rejet_rejeté_le,
    MAX(CASE WHEN j.key = 'rejet.rejetéPar' THEN j.value END) AS rejet_rejeté_par
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'recours|%'
GROUP BY t.key;