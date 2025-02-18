import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'puissanceTotaleMiseEnService';

export const cleanPuissanceTotaleMiseEnService = cleanScalarStatistic(statisticType);

export const computePuissanceTotaleMiseEnService = () =>
  executeQuery(
    `
          insert
          into 
            domain_public_statistic.scalar_statistic
          values(
            $1, 
            (
              select 
                  sum( proj.puissance)
              from
                  domain_views.projection p
                  join projects proj on format('%s#%s#%s#%s', proj."appelOffreId", proj."periodeId", proj."familleId", proj."numeroCRE")=p.value->>'identifiantProjet'
              where 
                    p.key like 'raccordement|%'
                    and NOT EXISTS ( 
                        SELECT 1
                        FROM jsonb_array_elements(value->'dossiers') AS dossier
                        WHERE dossier->'miseEnService'->>'dateMiseEnService' is null
                    )
                    AND jsonb_array_length(value->'dossiers') > 0
            )
          )
          `,
    statisticType,
  );
