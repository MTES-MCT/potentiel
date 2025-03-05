DROP VIEW IF EXISTS domain_private_statistic.candidature;

CREATE VIEW domain_private_statistic.candidature AS
select

        MAX(CASE WHEN j.key = 'identifiantProjet' THEN j.value END) AS identifiant_projet,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 1) END) AS appel_offre,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 2) END) AS periode,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 3) END) AS famille,
    MAX(CASE WHEN j.key = 'identifiantProjet' THEN split_part(j.value, '#', 4) END) AS numero_cre,

    -- statut
    MAX(CASE WHEN j.key = 'statut' THEN j.value END) AS statut,

    -- nomProjet
    MAX(CASE WHEN j.key = 'nomProjet' THEN j.value END) AS nom_projet,

    -- typeGarantiesFinancières
    MAX(CASE WHEN j.key = 'typeGarantiesFinancières' THEN j.value END) AS type_garanties_financieres,

    -- historiqueAbandon
    MAX(CASE WHEN j.key = 'historiqueAbandon' THEN j.value END) AS historique_abandon,

    -- localité
    MAX(CASE WHEN j.key = 'localité.adresse1' THEN j.value END) AS localite_adresse1,
    MAX(CASE WHEN j.key = 'localité.adresse2' THEN j.value END) AS localite_adresse2,
    MAX(CASE WHEN j.key = 'localité.codePostal' THEN j.value END) AS localite_code_postal,
    MAX(CASE WHEN j.key = 'localité.commune' THEN j.value END) AS localite_commune,
    MAX(CASE WHEN j.key = 'localité.département' THEN j.value END) AS localite_departement,
    MAX(CASE WHEN j.key = 'localité.région' THEN j.value END) AS localite_region,

    -- nomCandidat
    MAX(CASE WHEN j.key = 'nomCandidat' THEN j.value END) AS nom_candidat,

    -- nomReprésentantLégal
    MAX(CASE WHEN j.key = 'nomReprésentantLégal' THEN j.value END) AS nom_representant_legal,

    -- emailContact
    MAX(CASE WHEN j.key = 'emailContact' THEN j.value END) AS email_contact,

    -- puissanceProductionAnnuelle
    MAX(CASE WHEN j.key = 'puissanceProductionAnnuelle' THEN j.value::NUMERIC END) AS puissance_production_annuelle,

    -- prixReference
    MAX(CASE WHEN j.key = 'prixReference' THEN j.value::NUMERIC END) AS prix_reference,

    -- technologie
    MAX(CASE WHEN j.key = 'technologie' THEN j.value END) AS technologie,

    -- sociétéMère
    MAX(CASE WHEN j.key = 'sociétéMère' THEN j.value END) AS societe_mere,

    -- noteTotale
    MAX(CASE WHEN j.key = 'noteTotale' THEN j.value END) AS note_totale,
    -- motifÉlimination
    MAX(CASE WHEN j.key = 'motifÉlimination' THEN j.value END) AS motif_elimination,

    -- puissanceALaPointe
    MAX(CASE
        WHEN j.key = 'puissanceALaPointe'
            THEN
                CASE
                    WHEN j.value = 'true'
                    THEN 1
                    ELSE 0
                END
            END
        )::BOOLEAN AS puissance_a_la_pointe,

    -- evaluationCarboneSimplifiée
    MAX(CASE WHEN j.key = 'evaluationCarboneSimplifiée' THEN j.value::NUMERIC END) AS evaluation_carbone_simplifiee,

    -- actionnariat
    MAX(CASE WHEN j.key = 'actionnariat' THEN j.value END) AS actionnariat,

    -- dateÉchéanceGf
    MAX(CASE WHEN j.key = 'dateÉchéanceGf' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS date_echeance_gf,

    -- territoireProjet
    MAX(CASE WHEN j.key = 'territoireProjet' THEN j.value END) AS territoire_projet,

    -- misÀJourLe
    MAX(CASE WHEN j.key = 'misÀJourLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS mis_a_jour_le,

    -- détailsMisÀJourLe
    MAX(CASE WHEN j.key = 'détailsMisÀJourLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS details_mis_a_jour_le,

    -- notification
    MAX(CASE WHEN j.key = 'notification.notifiéeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS notification_notifiee_le,
    MAX(CASE WHEN j.key = 'notification.notifiéePar' THEN j.value END) AS notification_notifiee_par,
    MAX(CASE WHEN j.key = 'notification.validateur' THEN j.value END) AS notification_validateur,
    MAX(CASE WHEN j.key = 'notification.attestation.généréeLe' THEN TO_TIMESTAMP(j.value, 'YYYY-MM-DD"T"HH24:MI:SS') END) AS notification_attestation_generee_le,
    MAX(CASE WHEN j.key = 'notification.attestation.format' THEN j.value END) AS notification_attestation_format
FROM domain_views.projection t,
LATERAL jsonb_each_text(value) j
WHERE t.key LIKE 'candidature|%'
GROUP BY t.key;