DROP VIEW IF EXISTS domain_private_statistic.dossier_raccordement;

CREATE VIEW domain_private_statistic.dossier_raccordement AS
SELECT
    -- identifiantGestionnaireRéseau
    MAX(CASE WHEN j.key = 'identifiantGestionnaireRéseau' THEN j.value END) AS identifiant_gestionnaire_réseau,
    
    -- identifiantProjet
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,

    -- référence
    MAX(CASE WHEN j.key = 'référence' THEN j.value END) AS référence,

    -- demandeComplèteRaccordement
    MAX(CASE WHEN j.key = 'demandeComplèteRaccordement.dateQualification' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS demande_complete_raccordement_date_qualification,
    MAX(CASE WHEN j.key = 'demandeComplèteRaccordement.accuséRéception.format' THEN j.value END) AS demande_complete_raccordement_accusé_réception_format,

    -- propositionTechniqueEtFinancière
    MAX(CASE WHEN j.key = 'propositionTechniqueEtFinancière.dateSignature' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS proposition_technique_et_financière_date_signature,
    MAX(CASE WHEN j.key = 'propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.format' THEN j.value END) AS proposition_technique_et_financière_signée_format,

    -- miseEnService
    MAX(CASE WHEN j.key = 'miseEnService.dateMiseEnService' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS mise_en_service_date_mise_en_service,
    MAX(CASE WHEN j.key = 'miseEnService.transmiseLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS mise_en_service_transmise_le,
    MAX(CASE WHEN j.key = 'miseEnService.tranmisePar' THEN j.value END) AS mise_en_service_tranmise_par,

    -- misÀJourLe
    MAX(CASE WHEN j.key = 'misÀJourLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS mis_a_jour_le
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'dossier-raccordement|%'
GROUP BY t.key;