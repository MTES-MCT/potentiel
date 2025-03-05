DROP VIEW IF EXISTS domain_private_statistic.candidature;

CREATE VIEW domain_private_statistic.candidature AS
SELECT
    -- identifiantProjet 
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    
    -- appelOffre
    MAX(CASE WHEN j.key = 'appelOffre' THEN j.value END) AS appel_offre,

    -- période
    MAX(CASE WHEN j.key = 'période' THEN j.value END) AS période,

    -- statut
    MAX(CASE WHEN j.key = 'statut' THEN j.value END) AS statut,

    -- nomProjet
    MAX(CASE WHEN j.key = 'nomProjet' THEN j.value END) AS nom_projet,

    -- typeGarantiesFinancières
    MAX(CASE WHEN j.key = 'typeGarantiesFinancières' THEN j.value END) AS type_garanties_financières,

    -- historiqueAbandon
    MAX(CASE WHEN j.key = 'historiqueAbandon' THEN j.value END) AS historique_abandon,

    -- localité
    MAX(CASE WHEN j.key = 'localité.adresse1' THEN j.value END) AS localité_adresse1,
    MAX(CASE WHEN j.key = 'localité.adresse2' THEN j.value END) AS localité_adresse2,
    MAX(CASE WHEN j.key = 'localité.codePostal' THEN j.value END) AS localité_code_postal,
    MAX(CASE WHEN j.key = 'localité.commune' THEN j.value END) AS localité_commune,
    MAX(CASE WHEN j.key = 'localité.département' THEN j.value END) AS localité_département,
    MAX(CASE WHEN j.key = 'localité.région' THEN j.value END) AS localité_région,

    -- nomCandidat
    MAX(CASE WHEN j.key = 'nomCandidat' THEN j.value END) AS nom_candidat,

    -- nomReprésentantLégal
    MAX(CASE WHEN j.key = 'nomReprésentantLégal' THEN j.value END) AS nom_représentant_légal,

    -- emailContact
    MAX(CASE WHEN j.key = 'emailContact' THEN j.value END) AS email_contact,

    -- puissanceProductionAnnuelle
    MAX(CASE WHEN j.key = 'puissanceProductionAnnuelle' THEN j.value::NUMERIC END) AS puissance_production_annuelle,

    -- prixReference
    MAX(CASE WHEN j.key = 'prixReference' THEN j.value::NUMERIC END) AS prix_reference,

    -- technologie
    MAX(CASE WHEN j.key = 'technologie' THEN j.value END) AS technologie,

    -- sociétéMère
    MAX(CASE WHEN j.key = 'sociétéMère' THEN j.value END) AS société_mère,

    -- noteTotale
    MAX(CASE WHEN j.key = 'noteTotale' THEN j.value::NUMERIC END) AS note_totale,

    -- motifÉlimination
    MAX(CASE WHEN j.key = 'motifÉlimination' THEN j.value END) AS motif_élimination,

    -- puissanceALaPointe
    MAX(CASE WHEN j.key = 'puissanceALaPointe' THEN j.value::BOOLEAN END) AS puissance_a_la_pointe,

    -- evaluationCarboneSimplifiée
    MAX(CASE WHEN j.key = 'evaluationCarboneSimplifiée' THEN j.value::NUMERIC END) AS evaluation_carbone_simplifiée,

    -- actionnariat
    MAX(CASE WHEN j.key = 'actionnariat' THEN j.value END) AS actionnariat,

    -- dateÉchéanceGf
    MAX(CASE WHEN j.key = 'dateÉchéanceGf' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS date_échéance_gf,

    -- territoireProjet
    MAX(CASE WHEN j.key = 'territoireProjet' THEN j.value END) AS territoire_projet,

    -- misÀJourLe
    MAX(CASE WHEN j.key = 'misÀJourLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS mis_a_jour_le,

    -- détailsMisÀJourLe
    MAX(CASE WHEN j.key = 'détailsMisÀJourLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS détails_mis_a_jour_le,

    -- notification
    MAX(CASE WHEN j.key = 'notification.notifiéeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS notification_notifiée_le,
    MAX(CASE WHEN j.key = 'notification.notifiéePar' THEN j.value END) AS notification_notifiée_par,
    MAX(CASE WHEN j.key = 'notification.validateur' THEN j.value END) AS notification_validateur,
    MAX(CASE WHEN j.key = 'notification.attestation.généréeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS notification_attestation_générée_le,
    MAX(CASE WHEN j.key = 'notification.attestation.format' THEN j.value END) AS notification_attestation_format
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'candidature|%'
GROUP BY t.key;