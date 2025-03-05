DROP VIEW domain_private_statistic.abandon;

CREATE VIEW domain_private_statistic.abandon as
SELECT
    -- identifiantProjet 
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 1) END) AS appel_offre,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 2) END) AS periode,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 3) END) AS famille,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 4) END) AS numero_cre,
    
    -- demande
    MAX(CASE WHEN j.key = 'statut' THEN j.value END) AS statut,
    MAX(CASE WHEN j.key = 'demande.raison' THEN j.value END) AS demande_raison,
    MAX(CASE WHEN j.key = 'demande.demandéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_demande_le,
    MAX(CASE WHEN j.key = 'demande.demandéPar' THEN j.value END) AS demande_demande_par,
    MAX(CASE
          WHEN j.key = 'demande.pièceJustificative'
              THEN 1
              ELSE 0
          END
    )::BOOLEAN AS demande_a_une_piece_justificative,


    -- recandidature
    MAX(CASE
            WHEN j.key = 'demande.estUneRecandidature'
                THEN 1
                ELSE 0
            END
    )::BOOLEAN AS demande_est_une_recandidature,
    MAX(CASE WHEN j.key = 'demande.recandidature.statut' THEN j.value END) AS demande_recandidature_statut,
    MAX(CASE WHEN j.key = 'demande.recandidature.preuve.identifiantProjet' THEN j.value END) AS demande_recandidature_preuve_identifiant_projet,
    MAX(CASE WHEN j.key = 'demande.recandidature.preuve.demandéeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_recandidature_preuve_demande_le,
    MAX(CASE WHEN j.key = 'demande.recandidature.preuve.transmiseLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_recandidature_preuve_transmise_le,
    MAX(CASE WHEN j.key = 'demande.recandidature.preuve.transmisePar' THEN j.value END) AS demande_recandidature_preuve_transmise_par,

    -- confirmation
    MAX(CASE
      WHEN j.key = 'demande.confirmation.demandéeLe'
        THEN 1
        ELSE 0
      END
    )::BOOLEAN AS demande_a_une_confirmation,
    MAX(CASE WHEN j.key = 'demande.confirmation.demandéeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_confirmation_demandee_le,
    MAX(CASE WHEN j.key = 'demande.confirmation.demandéePar' THEN j.value END) AS confirmation_demandee_par,
    MAX(CASE WHEN j.key = 'demande.confirmation.confirméLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_confirmation_confirme_le,
    MAX(CASE WHEN j.key = 'demande.confirmation.confirméPar' THEN j.value END) AS demande_confirmation_confirme_par,


    -- instruction
    MAX(CASE
            WHEN j.key = 'demande.instruction'
                THEN 1
                ELSE 0
            END
    )::BOOLEAN AS demande_est_en_instruction,
    MAX(CASE WHEN j.key = 'demande.instruction.passéEnInstructionLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_instruction_passe_en_instruction_le,
    MAX(CASE WHEN j.key = 'demande.instruction.passéEnInstructionPar' THEN j.value END) AS demande_instruction_passe_en_instruction_par,

    -- accord
    MAX(CASE
            WHEN j.key = 'demande.accord.accordéLe'
                THEN 1
                ELSE 0
            END
    )::BOOLEAN AS demande_a_un_accord,
    MAX(CASE WHEN j.key = 'demande.accord.accordéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_accord_accorde_le,
    MAX(CASE WHEN j.key = 'demande.accord.accordéPar' THEN j.value END) AS demande_accord_accorde_par,

    -- rejet
    MAX(CASE
            WHEN j.key = 'demande.rejet.rejetéLe'
                THEN 1
                ELSE 0
            END
    )::BOOLEAN AS demande_a_un_rejet,
    MAX(CASE WHEN j.key = 'demande.rejet.rejetéLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_rejet_rejete_le,
    MAX(CASE WHEN j.key = 'demande.rejet.rejetéPar' THEN j.value END) AS demande_rejet_rejete_par
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'abandon|%'
GROUP BY t.key;
