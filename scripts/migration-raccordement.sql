CREATE OR REPLACE PROCEDURE migration_raccordement()
LANGUAGE plpgsql
AS $$
    declare
        referenceDossier varchar;
        dateQualification timestamp;
        identifiantEnedis varchar DEFAULT '17X100A100A0001A';
        identifiantProjet varchar;
        projection jsonb;
        projet record;
        projets cursor for
            select
                p."id",
                p."appelOffreId",
                p."periodeId",
                p."familleId",
                p."numeroCRE",
                CASE 
                    WHEN r."identifiantGestionnaire" IS NOT NULL AND SUBSTRING(r."identifiantGestionnaire" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})') != ''
                    THEN SUBSTRING(r."identifiantGestionnaire" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})')

                    WHEN SUBSTRING("dcrFile"."storedAt" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})') != '' 
                    THEN SUBSTRING("dcrFile"."storedAt" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})') 
                    
                    WHEN SUBSTRING("ptfFile"."storedAt" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})') != '' 
                    THEN SUBSTRING("ptfFile"."storedAt" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})') 
                    
                    WHEN r."identifiantGestionnaire" IS NOT NULL
                    THEN r."identifiantGestionnaire"

                    ELSE 'Référence non transmise' 
                END as "identifiantGestionnaire",
                p."dateMiseEnService",
                p."dateFileAttente",
                "dcrFile"."storedAt" as "dcrFilePath",
                CAST(to_timestamp((dcr."valueDate" / 1000)) AS date) as "dcrDate",
                "ptfFile"."storedAt" as "ptfFilePath",
                r."ptfDateDeSignature"
            from projects p
            left join raccordements r on r."projetId" = p.id
            left join project_events dcr on dcr."projectId" = p.id and dcr.type = 'ProjectDCRSubmitted'
            left join files "dcrFile" on "dcrFile".id::text = dcr.payload->'file'->>'id' and "dcrFile".designation = 'dcr'
            left join files "ptfFile" on "ptfFile".id = r."ptfFichierId" and "ptfFile".designation = 'ptf';

begin
    open projets;

    loop
        fetch projets into projet;
        exit when not found;
        identifiantProjet := projet."appelOffreId" || '#' || projet."periodeId" || '#' || projet."familleId" || '#' || projet."numeroCRE";
        referenceDossier := 'Référence non transmise';
        dateQualification := null;

        if projet."identifiantGestionnaire" is not null then
            referenceDossier := projet."identifiantGestionnaire";
        end if;

        if projet."dcrDate" is not null then
            dateQualification := projet."dcrDate";
        else
            if projet."dateFileAttente" is not null then
                dateQualification := projet."dateFileAttente";
            end if;
        end if;

        -- Insert des events dans le stream
        INSERT
            INTO "EVENT_STREAM" ("streamId", "createdAt", "type", "version", "payload")
            VALUES(
                   'raccordement#' || identifiantProjet,
                   to_json(now()),
                   'DemandeComplèteDeRaccordementTransmise',
                    1,
                    CASE
                        WHEN dateQualification is not null then
                            json_build_object(
                                'identifiantProjet', identifiantProjet,
                                'identifiantGestionnaireRéseau', identifiantEnedis,
                                'dateQualification', dateQualification,
                                'référenceDossierRaccordement',  referenceDossier
                            )
                        ELSE
                            json_build_object(
                                'identifiantProjet', identifiantProjet,
                                'identifiantGestionnaireRéseau', identifiantEnedis,
                                'référenceDossierRaccordement',  referenceDossier
                            )
                    END
            );

        if projet."ptfDateDeSignature" is not null then
            INSERT
            INTO "EVENT_STREAM" ("streamId", "createdAt", "type", "version", "payload")
            VALUES(
                   'raccordement#' || identifiantProjet,
                   to_json(now() + interval '1 second'),
                   'PropositionTechniqueEtFinancièreTransmise',
                    1,
                    json_build_object(
                        'identifiantProjet', identifiantProjet,
                        'référenceDossierRaccordement',  referenceDossier,
                        'dateSignature', projet."ptfDateDeSignature"
                    )
            );
        end if;

        if projet."dateMiseEnService" is not null then
            INSERT
            INTO "EVENT_STREAM" ("streamId", "createdAt", "type", "version", "payload")
            VALUES(
                   'raccordement#' || identifiantProjet,
                   to_json(now() + interval '2 second'),
                   'DateMiseEnServiceTransmise',
                    1,
                    json_build_object(
                        'identifiantProjet', identifiantProjet,
                        'référenceDossierRaccordement',  referenceDossier,
                        'dateMiseEnService', projet."dateMiseEnService"
                    )
            );
        end if;

        -- Insert de la projection 'dossier-raccordement'
        projection := json_build_object('référence', referenceDossier);

        if dateQualification is not null then
            projection := jsonb_set(projection, '{dateQualification}', to_jsonb(to_json(dateQualification)));
        end if;

        if projet."ptfDateDeSignature" is not null THEN
            projection := jsonb_set(projection, '{propositionTechniqueEtFinancière}', '{ "dateSignature":  null }'::jsonb);
            projection := jsonb_set(projection, '{propositionTechniqueEtFinancière, dateSignature}', to_jsonb(to_json(projet."ptfDateDeSignature")));
        end if;

        if projet."dateMiseEnService" is not null then
            projection := jsonb_set(projection, '{dateMiseEnService}', to_jsonb(to_json(projet."dateMiseEnService")));
        end if;

        INSERT INTO "PROJECTION" ("key", "value")
        VALUES (
            'dossier-raccordement#' || identifiantProjet || '#' || referenceDossier,
            projection
        );

        -- Insert de la projection 'liste-dossiers-raccordement'
        /*
        export type ListeDossiersRaccordementReadModel = ReadModel<
          'liste-dossiers-raccordement',
          {
            références: Array<string>;
          }
        >;
        */
        INSERT INTO "PROJECTION" ("key", "value")
        VALUES (
            'liste-dossiers-raccordement#' || identifiantProjet,
            json_build_object(
                'références',
                json_build_array(referenceDossier)
            )
        );

        -- Insert de la projection 'projet'
        /*
        export type ProjetReadModel = ReadModel<
          'projet',
          {
            identifiantGestionnaire?: IdentifiantGestionnaireRéseau;
          }
        >;
        */

        INSERT INTO "PROJECTION" ("key", "value")
        VALUES (
            'projet#' || identifiantProjet,
            json_build_object(
                'identifiantGestionnaire',
                json_build_object('codeEIC', identifiantEnedis)
            )
        );

    end loop;
end;
$$