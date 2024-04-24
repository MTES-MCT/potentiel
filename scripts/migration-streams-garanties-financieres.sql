--TO DO ! Avant de jouer ces requêtes vérifier qu'on a tous les types de fichiers pris en compte

-- Migration des garanties financières demandées [projet classé, non abandonné, pas de GF et une date limite d'envoi définie, ou à traiter avec date limite d'envoi]

INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
   TO_CHAR(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 
    'GarantiesFinancièresDemandées-V1',
    (SELECT count(stream_id) + 1 from event_store.event_stream WHERE stream_id = 'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
    	'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
    	'dateLimiteSoumission', TO_CHAR(gf."dateLimiteEnvoi", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 
    	'demandéLe', TO_CHAR(gf."updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'motif', 'motif-inconnu'
    )
FROM "garantiesFinancières" gf
JOIN "projects" p
ON gf."projetId" = p.id
WHERE gf."dateLimiteEnvoi" IS NOT NULL 		
	AND (gf.statut = 'en attente' OR gf.statut = 'à traiter')
    AND p."abandonedOn" = 0
    AND p.classe = 'Classé';

-- Migration des dépôts de garanties financières soumises [GF avec le statut à traiter, ou qui ont été soumises avant d'être validées]

INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
   TO_CHAR(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'DépôtGarantiesFinancièresSoumis-V1',
    (SELECT count(stream_id) + 1 FROM event_store.event_stream WHERE stream_id = 'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
	    'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
        'type', 
        	CASE 
	        	WHEN gf.type = 'Garantie financière avec date d''échéance et à renouveler' THEN 'avec-date-échéance'
				WHEN gf.type = 'Consignation' THEN 'consignation'
				WHEN gf.type = 'Garantie financière jusqu''à 6 mois après la date d''achèvement' THEN 'six-mois-après-achèvement'
	        	ELSE 'type-inconnu' 
        	END,
    	'dateÉchéance', CASE WHEN gf."dateEchéance" IS NOT NULL THEN TO_CHAR(gf."dateEchéance", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') ELSE NULL END,
        'attestation', json_build_object('format', 
            CASE
				WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) = 'msg' THEN 'application/vnd.ms-outlook'
	            WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) IN ('pdf', 'PDF') THEN 'application/pdf'
                WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) = 'tif' THEN 'image/tiff'
                WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) IN ('png', 'PNG') THEN 'image/png'
                WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) IN ('jpg', 'jpeg') THEN 'image/jpeg'
	       	END
            ), 
        'dateConstitution', TO_CHAR(gf."dateConstitution", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'soumisLe', TO_CHAR(gf."dateEnvoi", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'soumisPar', u.email
    )
FROM "garantiesFinancières" gf
	JOIN "projects" p ON gf."projetId" = p.id
	JOIN "files" f ON gf."fichierId" = f.id
	JOIN "users" u ON gf."envoyéesPar" = u.id
WHERE gf.statut = 'à traiter' OR (gf.statut = 'validé' AND gf."validéesPar" IS NOT NULL);

-- Migration des GF actuelles - validées dans Potentiel [GF avec le statut validé avec validéesPar] 
   
INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
   TO_CHAR(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'DépôtGarantiesFinancièresEnCoursValidé-V1',
    (SELECT count(stream_id) + 1 from event_store.event_stream WHERE stream_id = 'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
    	'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
        'validéLe', TO_CHAR(gf."validéesLe", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'validéPar', u.email    
    )
FROM "garantiesFinancières" gf
	JOIN "projects" p ON gf."projetId" = p.id
	JOIN "users" u ON gf."validéesPar" = u.id
WHERE gf.statut = 'validé' AND gf."validéesPar" IS NOT NULL;
   
-- Migration des GF actuelles - enregistrées par un admin [GF avec le statut validé mais pas de validateur dans Potentiel (validéesPar)]

INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
   TO_CHAR(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'GarantiesFinancièresEnregistrées-V1',
    (SELECT count(stream_id) + 1 from event_store.event_stream WHERE stream_id = 'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
    	'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
        'attestation', json_build_object('format', 
            CASE
                WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) IN ('pdf', 'PDF') THEN 'application/pdf'
                WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) = 'msg' THEN 'application/vnd.ms-outlook'
                WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) = 'tif' THEN 'image/tiff'
                WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) = 'png' THEN 'image/png'
                WHEN REVERSE(SPLIT_PART(REVERSE(f.filename), '.', 1)) IN ('jpg', 'jpeg') THEN 'image/jpeg'
            END
            ),                         
        'dateConstitution', TO_CHAR(gf."dateConstitution", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'type', 
        	CASE 
	        	WHEN gf.type = 'Garantie financière avec date d''échéance et à renouveler' THEN 'avec-date-échéance'
				WHEN gf.type = 'Consignation' THEN 'consignation'
				WHEN gf.type = 'Garantie financière jusqu''à 6 mois après la date d''achèvement' THEN 'six-mois-après-achèvement'
	        	ELSE 'type-inconnu' 
        	END,
        'dateÉchéance', CASE WHEN gf."dateEchéance" IS NOT NULL THEN TO_CHAR(gf."dateEchéance", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') ELSE NULL END,
        'enregistréLe', TO_CHAR(gf."dateEnvoi", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'enregistréPar', u.email    
    )
FROM "garantiesFinancières" gf
	JOIN "projects" p ON gf."projetId" = p.id
	JOIN "files" f ON gf."fichierId" = f.id
	JOIN "users" u ON gf."envoyéesPar" = u.id
WHERE gf.statut = 'validé' AND gf."validéesPar" IS NULL;

-- Migration des GF pour lesquelles le type et la date d'échéance ont été importés et le fichier est encore en attente

INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
   TO_CHAR(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'TypeGarantiesFinancièresImporté-V1',
    (SELECT count(stream_id) + 1 from event_store.event_stream WHERE stream_id = 'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
    	'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
        'type', 
        	CASE 
	        	WHEN gf.type = 'Garantie financière avec date d''échéance et à renouveler' THEN 'avec-date-échéance'
				WHEN gf.type = 'Consignation' THEN 'consignation'
				WHEN gf.type = 'Garantie financière jusqu''à 6 mois après la date d''achèvement' THEN 'six-mois-après-achèvement'
	        	ELSE 'type-inconnu' 
        	END,
        'dateÉchéance', CASE WHEN gf."dateEchéance" IS NOT NULL THEN TO_CHAR(gf."dateEchéance", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') ELSE NULL END,
        'importéLe', TO_CHAR(gf."updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
    )
FROM "garantiesFinancières" gf
	JOIN "projects" p ON gf."projetId" = p.id
WHERE gf.statut = 'en attente' AND gf.type IS NOT NULL AND p.classe = 'Classé';

-- Migration des GF pour lesquelles le type n'a pas été importé mais pour lesquelles on souhaite des GF validées avec un type inconnu
-- Il s'agit des projets PPE2 pour lesquels le type de GF n'a pas été importé

INSERT INTO
    event_store.event_stream(stream_id, created_at, type, version, payload)
SELECT 
    'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
   TO_CHAR(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'TypeGarantiesFinancièresImporté-V1',
    (SELECT count(stream_id) + 1 from event_store.event_stream WHERE stream_id = 'garanties-financieres|' || p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"),
    json_build_object(
    	'identifiantProjet', p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE",
        'type', 'type-inconnu',
        'dateÉchéance', NULL,
        'importéLe', TO_CHAR(gf."updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
    )
FROM "garantiesFinancières" gf
	JOIN "projects" p ON gf."projetId" = p.id
WHERE
    gf.type IS NULL 
    AND gf.statut = 'en attente' 
    AND gf."dateLimiteEnvoi" IS NULL 
    AND gf."soumisesALaCandidature" = true
    AND p."abandonedOn" = 0 
    AND p.classe = 'Classé'
    AND p."motifsElimination" = ''; --on retire les cas qui ont un motif d'élimination car il s'agit projets ayant bénéficié d'un recours accordé
        