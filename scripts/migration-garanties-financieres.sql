CREATE OR REPLACE PROCEDURE migration_garanties_financieres()
LANGUAGE plpgsql
AS $$
    declare
        identifiantProjet varchar;
        projet record;
        projets cursor for
            select
                p."id",
                p."appelOffreId",
                p."periodeId",
                p."familleId",
                p."numeroCRE",
            from projects p;

begin
    open projets;

    loop
        fetch projets into projet;
        exit when not found;
        identifiantProjet := projet."appelOffreId" || '#' || projet."periodeId" || '#' || projet."familleId" || '#' || projet."numeroCRE";

        INSERT 
            INTO "EVENT_STREAM" ("streamId", "createdAt", "type", "version", "payload")
            SELECT 
                'garanties-financieres|' || identifiantProjet,
                es.occurredAt, 
                CASE 
                    WHEN es.type = 'ProjectGFDueDateSet' THEN 'GarantiesFinancièresDemandées-V1'
                    WHEN es.type = 'ProjectGFDueDateCancelled' THEN 'DateLimiteEnvoiGarantiesFinancièresSupprimée-V1'
                    WHEN es.type = 'ProjectGFSubmitted' THEN 'DépôtGarantiesFinancièresSoumis-V1'
                    WHEN es.type = 'ProjectGFRemoved' THEN 'DépôtGarantiesFinancièresEnCoursSupprimé-V1'
                    WHEN es.type = 'GarantiesFinancièresValidées' THEN 'DépôtGarantiesFinancièresEnCoursValidé-V1'
                    -- WHEN es.type = 'GarantiesFinancièresInvalidées' THEN ''
                    -- event manquant pour GarantiesFinancièresInvalidées : sur 10 occurrence, 9 GF ont été revalidées ensuite, on peut ignorer cet event et faire une correction manuelle post migration pour le seul cas réel
                    WHEN es.type = 'ProjectGFUploaded' THEN 'GarantiesFinancièresEnregistrées-V1',
                    WHEN es.type = 'ProjectGFWithdrawn' THEN ''-- event manquant : à ajouter
                    WHEN es.type = 'TypeGarantiesFinancièresEtDateEchéanceTransmis' THEN 'TypeGarantiesFinancièresImporté-V1'
                    WHEN es.type = 'DateEchéanceGFAjoutée' THEN 'TypeGarantiesFinancièresImporté-V1'
                    WHEN es.type = 'DateEchéanceGarantiesFinancièresSupprimée' THEN '' -- event manquant : à ajouter
                    WHEN es.type = 'EtapeGFSupprimée' THEN ''-- event manquant : 15 occurrences, on peut archiver les events correspondants après première migration
                END,    
                1 -- vérifier si on met bien 1 partout
                CASE    
                    WHEN es.type = 'ProjectGFDueDateSet' THEN json_build_object(
                        'identifiantProjet', identifiantProjet,
                        'dateLimiteSoumission', es.payload->>'garantiesFinancieresDueOn', 
                        'demandéLe', es."occurredAt"
                        )
                    WHEN es.type = 'ProjectGFDueDateCancelled' THEN json_build_object(
                        'identifiantProjet', identifiantProjet,
                        'suppriméLe', es."occurredAt"
                    ) 
                    WHEN es.type = 'ProjectGFSubmitted' THEN json_build_object(
                        'identifiantProjet', identifiantProjet,
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
                        'identifiantProjet', identifiantProjet,
                        'suppriméLe', es."occurredAt",
                        'suppriméPar', es.payload->>'removedBy'
                        )
                    WHEN es.type = 'GarantiesFinancièresValidées' THEN json_build_object(
                        'identifiantProjet', identifiantProjet,
                        'validéLe': es."occurredAt",
                        'validéPar': users.email
                    )
                    WHEN es.type = 'GarantiesFinancièresInvalidées' THEN json_build_object() -- event manquant
                    WHEN es.type = 'ProjectGFUploaded' THEN json_build_object(
                        'attestation', json_build_object('format', 
                            case
                                when substring("storedAt" from '\.([^.]*)$') = 'tif' then 'image/tiff'
                                when substring("storedAt" from '\.([^.]*)$') = 'msg' then 'application/vnd.ms-outlook'
                                when substring("storedAt" from '\.([^.]*)$') = 'pdf' then 'application/pdf'
                                when substring("storedAt" from '\.([^.]*)$') = 'PDF' then 'application/pdf'
                            end
                            ),                         'dateConstitution', es.payload->>'gfDate',
                        'identifiantProjet', identifiantProjet,
                        'type', 'type-inconnu',
                        'dateÉchéance', es.payload->>'expirationDate',
                        'enregistréLe', es."occurredAt",
                        'enregistréPar', users.email
                    )
                    WHEN es.type = 'ProjectGFWithdrawn' THEN json_build_object() -- event manquant
                    WHEN es.type = 'TypeGarantiesFinancièresEtDateEchéanceTransmis' THEN json_build_object(
                        'identifiantProjet', identifiantProjet,
                        'type', es.payload->>'type',
                        'dateÉchéance', s.payload->>'dateEchéance',
                        'importéLe', es."occurredAt",
                        -- importéPar doit être optionnel dans l'event
                    ) 
                    WHEN es.type = 'DateEchéanceGFAjoutée' THEN json_build_object(
                        'identifiantProjet', identifiantProjet,
                        'type', 'type-inconnu',
                        'dateÉchéance', s.payload->>'expirationDate',
                        'importéLe', es."occurredAt",
                        'importéPar', es.payload->>'submittedBy'
                    ) 
                    WHEN es.type = 'DateEchéanceGarantiesFinancièresSupprimée' THEN json_build_object() -- à revérifier mais pour le moment cet event n'a pas encore été émis
                    WHEN es.type = 'EtapeGFSupprimée' THEN json_build_object() -- event manquant
                END,    
            FROM 
                eventStores es
            JOIN files ON es.payload->>'fileId' = files.id::text
            JOIN users ON (es.payload->>'submittedBy' = users.id::text OR es.payload->>'validéesPar' = users.id::text)   
            WHERE 
                (es.payload->>'projetId' = projet.id OR es.payload->>'projectId' = projet.id) 
                AND es.type IN (
                                'ProjectGFDueDateSet', 
                                'ProjectGFDueDateCancelled', 
                                'ProjectGFSubmitted', 
                                'ProjectGFRemoved', 
                                'GarantiesFinancièresValidées', 
                                'GarantiesFinancièresInvalidées', 
                                'ProjectGFUploaded',
                                'ProjectGFWithdrawn', 
                                'TypeGarantiesFinancièresEtDateEchéanceTransmis', 
                                'DateEchéanceGFAjoutée', 
                                'DateEchéanceGarantiesFinancièresSupprimée', 
                                'EtapeGFSupprimée'
                                ); 
    end loop;
end;
$$