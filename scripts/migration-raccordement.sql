CREATE OR REPLACE PROCEDURE migration_raccordement()
LANGUAGE plpgsql
AS $$
    declare
        identifiantGestionnaire varchar;
        dateQualification timestamp;
        identifiantEnedis varchar DEFAULT '17X100A100A0001A';
        identifiantProjet varchar;
        projet record;
        projets cursor for
            select
                p."id",
                p."appelOffreId",
                p."periodeId",
                p."familleId",
                p."numeroCRE",
                r."identifiantGestionnaire",
                p."dateMiseEnService",
                p."dateFileAttente",
                "dcrFile"."storedAt" as "dcrFilePath",
                CAST(to_timestamp((dcr."valueDate" / 1000)) AS date) as "dcrDate",
                "ptfFile"."storedAt" as "ptfFilePath",
                r."ptfDateDeSignature"
            from projects p
            left join raccordements r on r."projetId" = p.id
            left join project_events dcr on dcr."projectId" = p.id and dcr.type = 'projetDCRSubmitted'
            left join files "dcrFile" on "dcrFile".id::text = dcr.payload->'file'->>'id' and "dcrFile".designation = 'dcr'
            left join files "ptfFile" on "ptfFile".id = r."ptfFichierId" and "ptfFile".designation = 'ptf';

begin
    open projets;

    loop
        fetch projets into projet;
        exit when not found;
        identifiantProjet := projet."appelOffreId" || '#' || projet."periodeId" || '#' || projet."familleId" || '#' || projet."numeroCRE";
        identifiantGestionnaire := 'Référence non transmise';
        dateQualification := null;

        if projet."identifiantGestionnaire" is not null then
            identifiantGestionnaire := projet."identifiantGestionnaire";
        end if;

        if projet."dcrDate" is not null then
            dateQualification := projet."dcrDate";
        else
            if projet."dateFileAttente" is not null then
                dateQualification := projet."dateFileAttente";
            end if;
        end if;

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
                                'référenceDossierRaccordement',  identifiantGestionnaire
                            )
                        ELSE
                            json_build_object(
                                'identifiantProjet', identifiantProjet,
                                'identifiantGestionnaireRéseau', identifiantEnedis,
                                'référenceDossierRaccordement',  identifiantGestionnaire
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
                        'référenceDossierRaccordement',  identifiantGestionnaire,
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
                        'référenceDossierRaccordement',  identifiantGestionnaire,
                        'dateMiseEnService', projet."dateMiseEnService"
                    )
            );
        end if;


    end loop;
end;
$$