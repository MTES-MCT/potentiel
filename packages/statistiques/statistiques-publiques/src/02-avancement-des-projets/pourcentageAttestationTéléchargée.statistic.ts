import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'pourcentageAttestationTéléchargée';

export const computePourcentageAttestationTéléchargée = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        SELECT
          (
            SELECT
              (
                count(
                  DISTINCT (
                    concat(
                      (c.données -> 'projet') ->> 'appelOffreId',
                      '|',
                      (c.données -> 'projet') ->> 'periodeId',
                      '|',
                      (c.données -> 'projet') ->> 'numeroCRE',
                      '|',
                      (c.données -> 'projet') ->> 'familleId'
                    )
                  )
                )::decimal
              )
            FROM
              "statistiquesUtilisation" c
            WHERE
              type = 'attestationTéléchargée'
          ) * 100 / (
            SELECT
              count("id")::decimal
            FROM
              "projects"
            WHERE
              DATE (TO_TIMESTAMP("notifiedOn" / 1000)) >= DATE ('2020-04-15')
          )
      )
    )
    `,
    statisticType,
  );
