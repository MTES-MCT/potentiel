CREATE OR REPLACE PROCEDURE gdr_declare()
LANGUAGE plpgsql
AS $$
    declare
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

    UPDATE "EVENT_STREAM" SET "createdAt" = TRIM(BOTH '"' FROM "createdAt");

    loop
        fetch projets into projet;
        exit when not found;
        identifiantProjet := projet."appelOffreId" || '#' || projet."periodeId" || '#' || projet."familleId" || '#' || projet."numeroCRE";

        -- Insert des events dans le stream
        INSERT
            INTO "EVENT_STREAM" (
                "streamId",
                "createdAt",
                "type",
                "version",
                "payload"
            )
            VALUES(
               'projet#' || identifiantProjet,
               '2023-05-10T11:16:10.284Z',
               'GestionnaireRéseauProjetDéclaré',
                1,
                json_build_object(
                    'identifiantProjet', identifiantProjet,
                    'identifiantGestionnaireRéseau', identifiantEnedis
                )
            );
    end loop;
end;
$$