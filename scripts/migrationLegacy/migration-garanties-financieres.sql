--Migration des dépôts en attente (pas de GF et une date limite d'envoi)

INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financières|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
    TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 
    'GarantiesFinancièresSnapshot-v1',
    (SELECT count(stream_id) + 1 from event_store.event_stream WHERE stream_id = 'garanties-financières|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
    'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
    'aggregate', json_build_object(
        'dateLimiteDépôt', TO_CHAR(gf."dateLimiteEnvoi", 'YYYY-MM-DD"T"HH24:MI:SS"+00:00"')
        )
    )
FROM "garantiesFinancières" gf
JOIN "projects" p
ON gf."projetId" = p.id
WHERE gf."dateLimiteEnvoi" IS NOT NULL 
    AND gf.statut = 'en attente' 
    AND p."abandonedOn" = 0
    AND p.classe = 'Classé';

-- Migration des dépôts à valider

INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financières|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
    TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'GarantiesFinancièresSnapshot-v1',
    (SELECT count(stream_id) + 1 from event_store.event_stream WHERE stream_id = 'garanties-financières|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
    'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
    'aggregate', json_build_object(
        'dépôt', json_build_object(
            'typeGarantiesFinancières', gf.type,
            'dateÉchéance', TO_CHAR(gf."dateEchéance", 'YYYY-MM-DD"T"HH24:MI:SS"+00:00"'), 
            'attestationConstitution', json_build_object(
                'format', (SELECT 
                            CASE
                                WHEN REVERSE(SPLIT_PART(REVERSE(filename), '.', 1)) IN ('pdf', 'PDF') THEN 'application/pdf'
                                WHEN REVERSE(SPLIT_PART(REVERSE(filename), '.', 1)) = 'msg' THEN 'application/vnd.ms-outlook'
                                WHEN REVERSE(SPLIT_PART(REVERSE(filename), '.', 1)) = 'tif' THEN 'image/tiff'
                            ELSE 'Type inconnu'
                            END AS mime_type
                            FROM  "files" 
                            WHERE id = gf."fichierId"), 
                'date', TO_CHAR(gf."dateConstitution", 'YYYY-MM-DD"T"HH24:MI:SS"+00:00"')
            ),
            'dateDépôt', TO_CHAR(gf."dateEnvoi", 'YYYY-MM-DD"T"HH24:MI:SS"+00:00"')
        ),
        'dateLimiteDépôt', TO_CHAR(gf."dateLimiteEnvoi", 'YYYY-MM-DD"T"HH24:MI:SS"+00:00"')
        )
    )
FROM "garantiesFinancières" gf
JOIN "projects" p
ON gf."projetId" = p.id
WHERE gf.statut = 'à traiter' 
    AND p."abandonedOn" = 0
    AND p.classe = 'Classé';

-- Migration des GF enregistrées

INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financières|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
    TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'GarantiesFinancièresSnapshot-v1',
    (SELECT count(stream_id) + 1 from event_store.event_stream WHERE stream_id = 'garanties-financières|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
    'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
    'aggregate', json_build_object(
        'actuelles', json_build_object(
            'typeGarantiesFinancières', gf.type,
            'dateÉchéance', TO_CHAR(gf."dateEchéance", 'YYYY-MM-DD"T"HH24:MI:SS"+00:00"'), 
            'attestationConstitution', json_build_object(
                'format', (SELECT 
                            CASE
                                WHEN REVERSE(SPLIT_PART(REVERSE(filename), '.', 1)) IN ('pdf', 'PDF') THEN 'application/pdf'
                                WHEN REVERSE(SPLIT_PART(REVERSE(filename), '.', 1)) = 'msg' THEN 'application/vnd.ms-outlook'
                                WHEN REVERSE(SPLIT_PART(REVERSE(filename), '.', 1)) = 'tif' THEN 'image/tiff'
                            ELSE 'Type inconnu'
                            END AS mime_type
                            FROM  "files" 
                            WHERE id = gf."fichierId"), 
                'date', TO_CHAR(gf."dateConstitution", 'YYYY-MM-DD"T"HH24:MI:SS"+00:00"')
            )
        )
        )
    )
FROM "garantiesFinancières" gf
JOIN "projects" p
ON gf."projetId" = p.id
WHERE gf.statut = 'validé';


        