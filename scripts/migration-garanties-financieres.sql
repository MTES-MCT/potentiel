INSERT INTO event_store.event_stream ("stream_id", "created_at", "type", "version", "payload")
SELECT 
    'garanties-financieres|' || projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
    es."occurredAt", 
    CASE 
        WHEN es.type = 'ProjectGFDueDateSet' THEN 'GarantiesFinancièresDemandées-V1'
        WHEN es.type = 'ProjectGFDueDateCancelled' THEN 'DateLimiteEnvoiGarantiesFinancièresSupprimée-V1'
        WHEN es.type = 'ProjectGFSubmitted' THEN 'DépôtGarantiesFinancièresSoumis-V1'
        WHEN es.type = 'ProjectGFRemoved' THEN 'DépôtGarantiesFinancièresEnCoursSupprimé-V1'
        WHEN es.type = 'GarantiesFinancièresValidées' THEN 'DépôtGarantiesFinancièresEnCoursValidé-V1'
        -- WHEN es.type = 'GarantiesFinancièresInvalidées' THEN ''
        -- event manquant pour GarantiesFinancièresInvalidées : sur 10 occurrence, 9 GF ont été revalidées ensuite, on peut ignorer cet event et faire une correction manuelle post migration pour le seul cas réel
        WHEN es.type = 'ProjectGFUploaded' THEN 'GarantiesFinancièresEnregistrées-V1'
        WHEN es.type = 'ProjectGFWithdrawn' THEN 'GarantiesFinancièresSupprimées-V1'
        WHEN es.type = 'TypeGarantiesFinancièresEtDateEchéanceTransmis' THEN 'TypeGarantiesFinancièresImporté-V1'
        WHEN es.type = 'DateEchéanceGFAjoutée' THEN 'TypeGarantiesFinancièresImporté-V1'
        WHEN es.type = 'DateEchéanceGarantiesFinancièresSupprimée' THEN 'TypeGarantiesFinancièresImporté-V1'
        -- WHEN es.type = 'EtapeGFSupprimée' THEN ''
        -- event manquant : 15 occurrences, on peut archiver les events correspondants après première migration
    END,    
    1, -- vérifier si on met bien 1 partout
    CASE    
        WHEN es.type = 'ProjectGFDueDateSet' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'dateLimiteSoumission', es.payload->>'garantiesFinancieresDueOn', 
            'demandéLe', es."occurredAt"
            )
        WHEN es.type = 'ProjectGFDueDateCancelled' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'suppriméLe', es."occurredAt"
        ) 
        WHEN es.type = 'ProjectGFSubmitted' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'type', 'type-inconnu',
            'dateÉchéance', es.payload->>'expirationDate',
            'attestation', json_build_object('format', 
                case
                    when substring("storedAt" from '\.([^.]*)$') = 'tif' then 'image/tiff'
                    when substring("storedAt" from '\.([^.]*)$') = 'msg' then 'application/vnd.ms-outlook'
                    when substring("storedAt" from '\.([^.]*)$') = 'pdf' then 'application/pdf'
                    when substring("storedAt" from '\.([^.]*)$') = 'PDF' then 'application/pdf'
                end
                ), 
            'dateConstitution', es.payload->>'gfDate',
            'soumisLe', es."occurredAt",
            'soumisPar', users.email
        )
        WHEN es.type = 'ProjectGFRemoved' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'suppriméLe', es."occurredAt",
            'suppriméPar', users.email
            )
        WHEN es.type = 'GarantiesFinancièresValidées' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'validéLe', es."occurredAt",
            'validéPar', users.email
        )
        --WHEN es.type = 'GarantiesFinancièresInvalidées' THEN json_build_object()
        WHEN es.type = 'ProjectGFUploaded' THEN json_build_object(
            'attestation', json_build_object('format', 
                case
                    when substring("storedAt" from '\.([^.]*)$') = 'tif' then 'image/tiff'
                    when substring("storedAt" from '\.([^.]*)$') = 'msg' then 'application/vnd.ms-outlook'
                    when substring("storedAt" from '\.([^.]*)$') = 'pdf' then 'application/pdf'
                    when substring("storedAt" from '\.([^.]*)$') = 'PDF' then 'application/pdf'
                end
                ),                         
            'dateConstitution', es.payload->>'gfDate',
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'type', 'type-inconnu',
            'dateÉchéance', es.payload->>'expirationDate',
            'enregistréLe', es."occurredAt",
            'enregistréPar', users.email
        )
        WHEN es.type = 'ProjectGFWithdrawn' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'suppriméLe', es."occurredAt",
            'suppriméPar', users.email
        )
        WHEN es.type = 'TypeGarantiesFinancièresEtDateEchéanceTransmis' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'type', es.payload->>'type',
            'dateÉchéance', es.payload->>'dateEchéance',
            'importéLe', es."occurredAt"
        ) 
        WHEN es.type = 'DateEchéanceGFAjoutée' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'type', 'type-inconnu',
            'dateÉchéance', es.payload->>'expirationDate',
            'importéLe', es."occurredAt",
            'importéPar', users.email
        ) 
        WHEN es.type = 'DateEchéanceGarantiesFinancièresSupprimée' THEN json_build_object(
            'identifiantProjet', projects."appelOffreId" || '#' || projects."periodeId" || '#' || projects."familleId" || '#' || projects."numeroCRE",
            'suppriméLe', es."occurredAt"
        ) 
        -- WHEN es.type = 'EtapeGFSupprimée' THEN json_build_object()
    END   
FROM 
"eventStores" es
JOIN projects ON (
    es.payload->>'projectId' = CAST(projects.id as TEXT) 
    OR es.payload->>'projectId' = CAST(projects.id as TEXT)
    )
JOIN files ON es.payload->>'fileId' = files.id::text
JOIN users ON (
    es.payload->>'submittedBy' = CAST(users.id as TEXT)
    OR es.payload->>'validéesPar' = CAST(users.id as TEXT)
    OR es.payload->>'removedBy' = CAST(users.id as TEXT)
    )   
WHERE es.type IN (
    'ProjectGFDueDateSet', 
    'ProjectGFDueDateCancelled', 
    'ProjectGFSubmitted', 
    'ProjectGFRemoved', 
    'GarantiesFinancièresValidées', 
    --'GarantiesFinancièresInvalidées', 
    'ProjectGFUploaded',
    'ProjectGFWithdrawn', 
    'TypeGarantiesFinancièresEtDateEchéanceTransmis', 
    'DateEchéanceGFAjoutée', 
    'DateEchéanceGarantiesFinancièresSupprimée'
    --'EtapeGFSupprimée'
    );