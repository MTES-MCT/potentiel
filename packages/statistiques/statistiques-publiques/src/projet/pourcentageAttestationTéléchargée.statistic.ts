import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'pourcentageAttestationTéléchargée';

export const cleanPourcentageAttestationTéléchargée = cleanScalarStatistic(statisticType);

export const computePourcentageAttestationTéléchargée = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select(
          select(
            count(distinct(concat(
                (c.données->'projet')->>'appelOffreId','|',
                (c.données->'projet')->>'periodeId','|',
                (c.données->'projet')->>'numeroCRE','|',
                (c.données->'projet')->>'familleId'
          ))))
          from "statistiquesUtilisation" c 
          where type = 'attestationTéléchargée'
        ) * 100
        / (select count("id") from "projects" where DATE(TO_TIMESTAMP("notifiedOn" / 1000)) >= DATE('2020-04-15'))
      )
    )
    `,
    statisticType,
  );
