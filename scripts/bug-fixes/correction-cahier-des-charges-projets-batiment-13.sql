-- Correction dans l'event store
INSERT INTO
      "eventStores" (
            "id",
            "aggregateId"
            "type",
            "version",
            "payload",
            "occurredAt",
            "createdAt",
            "updatedAt",
      )
VALUES
SELECT
      gen_random_uuid (),
      ARRAY["projects".id],
      'CahierDesChargesChoisi',
      '1',
      jsonb_build_object(
            'projetId', 
            "projects".id,
            'choisiPar',
            'potentiel',
            'type',
            'initial'
      ),
      now(),
      now(),
      now()
FROM
      "projects"
WHERE
      "cahierDesChargesActuel" = '30/07/2021'
      AND (
            "appelOffreId" in (
                  'PPE2 - Autoconsommation métropole',
                  'PPE2 - Sol',
                  'PPE2 - Bâtiment',
                  'Eolien'
            )
            OR (
                  "appelOffreId" = 'CRE4 - Bâtiment'
                  and "periodeId" = '13'
            )
      );

-- Correction de la frise 
INSERT INTO
      "project_events" (
            "id",
            "projectId",
            "type",
            "payload",
            "valueDate",
            "createdAt",
            "updatedAt",
            "eventPublishedAt"      
      )
VALUES
SELECT
      gen_random_uuid (),
      "projects".id,
      'CahierDesChargesChoisi',
      jsonb_build_object(
            'paruLe',
            '30/07/2021',
            'choisiPar',
            'potentiel',
            'type',
            'initial'
      ),
      extract(epoch FROM current_timestamp) * 1000,
      now(),
      now(),
      extract(epoch FROM current_timestamp) * 1000
FROM
      "projects"
WHERE
      "cahierDesChargesActuel" = '30/07/2021'
      AND (
            "appelOffreId" in (
                  'PPE2 - Autoconsommation métropole',
                  'PPE2 - Sol',
                  'PPE2 - Bâtiment',
                  'Eolien'
            )
            OR (
                  "appelOffreId" = 'CRE4 - Bâtiment'
                  and "periodeId" = '13'
            )
      );


-- Correction dans la projection "projects"
UPDATE
      "projects" 
SET "cahierDesChargesActuel" = 'initial'
WHERE
      "cahierDesChargesActuel" = '30/07/2021'
      AND (
            "appelOffreId" in (
                  'PPE2 - Autoconsommation métropole',
                  'PPE2 - Sol',
                  'PPE2 - Bâtiment',
                  'Eolien'
            )
            OR (
                  "appelOffreId" = 'CRE4 - Bâtiment'
                  and "periodeId" = '13'
            )
      );
