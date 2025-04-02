import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'pourcentageDCRDéposées';

export const computePourcentageDCRDéposées = () =>
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
            count(p.key)
          FROM
            domain_views.projection p
          WHERE
            p.key LIKE 'dossier-raccordement|%'
            AND p.value ->> 'demandeComplèteRaccordement.accuséRéception.format' IS NOT NULL
        )::decimal / (
          SELECT
            count(p.key)
          FROM
            domain_views.projection p
          WHERE
            p.key LIKE 'dossier-raccordement|%'
        )::decimal * 100   
      )
    )
    `,
    statisticType,
  );
